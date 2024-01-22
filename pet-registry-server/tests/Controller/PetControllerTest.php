<?php declare(strict_types=1);

namespace App\Tests\Controller;

use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class PetControllerTest extends WebTestCase
{
    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
    }

    public function testRegistersADogWithAKnownBreed(): void
    {
        $body = $this->postPet([
            'petType' => 'dog',
            'petName' => '  Biscuit ',
            'breed' => 'Beagle',
            'gender' => 'female',
        ]);

        self::assertResponseStatusCodeSame(201);
        self::assertSame('Pet registered.', $body['message']);
        self::assertSame([
            'petType' => 'dog',
            'petName' => 'Biscuit',
            'breed' => 'Beagle',
            'breedFallback' => null,
            'mixDescription' => null,
            'gender' => 'female',
        ], $body['pet']);
    }

    public function testRegistersAMixedBreedCatWithADescription(): void
    {
        $body = $this->postPet([
            'petType' => 'cat',
            'petName' => 'Pickle',
            'breedFallback' => 'mix',
            'mixDescription' => 'Tabby and Siamese',
            'gender' => 'male',
        ]);

        self::assertResponseStatusCodeSame(201);
        self::assertNull($body['pet']['breed']);
        self::assertSame('mix', $body['pet']['breedFallback']);
        self::assertSame('Tabby and Siamese', $body['pet']['mixDescription']);
    }

    public function testAcceptsAnUnknownBreed(): void
    {
        $body = $this->postPet([
            'petType' => 'cat',
            'petName' => 'Miso',
            'breedFallback' => 'unknown',
            'gender' => 'female',
        ]);

        self::assertResponseStatusCodeSame(201);
        self::assertSame('unknown', $body['pet']['breedFallback']);
    }

    public function testEmptyPayloadReportsEveryMissingField(): void
    {
        $body = $this->postPet([]);

        self::assertResponseStatusCodeSame(422);
        self::assertResponseFormatSame('json');
        self::assertEqualsCanonicalizing(
            ['petType', 'petName', 'breed', 'gender'],
            array_column($body['violations'], 'propertyPath'),
        );
    }

    /**
     * @param array<string, string> $overrides
     */
    #[DataProvider('invalidPayloads')]
    public function testRejectsInvalidField(array $overrides, string $field): void
    {
        $body = $this->postPet(array_merge([
            'petType' => 'dog',
            'petName' => 'Biscuit',
            'breed' => 'Beagle',
            'gender' => 'female',
        ], $overrides));

        self::assertResponseStatusCodeSame(422);
        self::assertSame([$field], array_column($body['violations'], 'propertyPath'));
    }

    /**
     * @return iterable<string, array{array<string, string>, string}>
     */
    public static function invalidPayloads(): iterable
    {
        yield 'unsupported pet type' => [['petType' => 'parrot'], 'petType'];
        yield 'whitespace-only name' => [['petName' => '   '], 'petName'];
        yield 'name over 50 characters' => [['petName' => str_repeat('a', 51)], 'petName'];
        yield 'unsupported gender' => [['gender' => 'unknown'], 'gender'];
        yield 'breed and fallback together' => [['breedFallback' => 'unknown'], 'breed'];
        yield 'mix description without a mix' => [['mixDescription' => 'Lab cross'], 'mixDescription'];
        yield 'unsupported fallback' => [['breed' => '', 'breedFallback' => 'other'], 'breedFallback'];
    }

    public function testRejectsAWronglyTypedField(): void
    {
        $body = $this->postPet([
            'petType' => 'dog',
            'petName' => 42,
            'breed' => 'Beagle',
            'gender' => 'female',
        ]);

        self::assertResponseStatusCodeSame(422);
        self::assertContains('petName', array_column($body['violations'], 'propertyPath'));
    }

    public function testRejectsMalformedJson(): void
    {
        $this->client->request('POST', '/api/v1/pet', server: ['CONTENT_TYPE' => 'application/json'], content: '{"petName":');

        self::assertResponseStatusCodeSame(400);
    }

    public function testOnlyAcceptsPost(): void
    {
        $this->client->request('GET', '/api/v1/pet');

        self::assertResponseStatusCodeSame(405);
    }

    public function testPreflightAllowsTheLocalClientOrigin(): void
    {
        $this->preflight('http://localhost:8080');

        self::assertResponseHeaderSame('Access-Control-Allow-Origin', 'http://localhost:8080');
        self::assertResponseNotHasHeader('Access-Control-Allow-Credentials');
    }

    public function testPreflightIgnoresForeignOrigins(): void
    {
        $this->preflight('https://evil.example');

        self::assertResponseNotHasHeader('Access-Control-Allow-Origin');
    }

    /**
     * @param array<string, mixed> $payload
     *
     * @return array<string, mixed>
     */
    private function postPet(array $payload): array
    {
        $this->client->request(
            'POST',
            '/api/v1/pet',
            server: ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'],
            content: json_encode($payload, \JSON_THROW_ON_ERROR),
        );

        return json_decode((string) $this->client->getResponse()->getContent(), true, flags: \JSON_THROW_ON_ERROR);
    }

    private function preflight(string $origin): void
    {
        $this->client->request('OPTIONS', '/api/v1/pet', server: [
            'HTTP_ORIGIN' => $origin,
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'POST',
            'HTTP_ACCESS_CONTROL_REQUEST_HEADERS' => 'content-type',
        ]);
    }
}

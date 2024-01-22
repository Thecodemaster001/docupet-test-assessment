<?php declare(strict_types=1);

namespace App\Tests\Request;

use App\Request\PetCreationRequest;
use PHPUnit\Framework\TestCase;

final class PetCreationRequestTest extends TestCase
{
    public function testToArrayTrimsTextAndDropsABlankBreed(): void
    {
        $request = new PetCreationRequest(
            petType: 'cat',
            petName: ' Pickle ',
            breed: '   ',
            breedFallback: 'mix',
            mixDescription: '  ',
            gender: 'male',
        );

        self::assertSame([
            'petType' => 'cat',
            'petName' => 'Pickle',
            'breed' => null,
            'breedFallback' => 'mix',
            'mixDescription' => null,
            'gender' => 'male',
        ], $request->toArray());
    }

    public function testToArrayDiscardsAMixDescriptionForOtherFallbacks(): void
    {
        $request = new PetCreationRequest(
            petType: 'dog',
            petName: 'Biscuit',
            breedFallback: 'unknown',
            mixDescription: 'Lab cross',
            gender: 'female',
        );

        self::assertNull($request->toArray()['mixDescription']);
    }
}

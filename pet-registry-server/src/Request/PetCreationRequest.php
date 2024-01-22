<?php declare(strict_types=1);

namespace App\Request;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

final class PetCreationRequest
{
    public const PET_TYPES = ['dog', 'cat'];
    public const GENDERS = ['female', 'male'];
    public const BREED_FALLBACKS = ['unknown', 'mix'];

    public function __construct(
        #[Assert\Choice(choices: self::PET_TYPES, message: 'Choose whether your pet is a dog or a cat.')]
        public readonly string $petType = '',

        #[Assert\NotBlank(message: "Your pet's name cannot be empty.", normalizer: 'trim')]
        #[Assert\Length(max: 50, maxMessage: "Your pet's name can be at most {{ limit }} characters.")]
        public readonly string $petName = '',

        #[Assert\Length(max: 60)]
        public readonly ?string $breed = null,

        #[Assert\Choice(choices: self::BREED_FALLBACKS, message: 'Breed fallback must be "unknown" or "mix".')]
        public readonly ?string $breedFallback = null,

        #[Assert\Length(max: 100)]
        public readonly ?string $mixDescription = null,

        #[Assert\Choice(choices: self::GENDERS, message: 'Choose female or male.')]
        public readonly string $gender = '',
    ) {
    }

    /**
     * A pet either has a known breed or says why it doesn't, never both:
     * the form only offers the fallback once the breed search comes up empty.
     */
    #[Assert\Callback]
    public function validateBreed(ExecutionContextInterface $context): void
    {
        $hasBreed = null !== $this->breed && '' !== trim($this->breed);
        $hasFallback = null !== $this->breedFallback;

        if ($hasBreed === $hasFallback) {
            $context->buildViolation('Give a breed, or say that it is unknown or a mix.')
                ->atPath('breed')
                ->addViolation();
        }

        if ('mix' !== $this->breedFallback && null !== $this->mixDescription && '' !== trim($this->mixDescription)) {
            $context->buildViolation('A mix description only applies when the breed is a mix.')
                ->atPath('mixDescription')
                ->addViolation();
        }
    }

    /**
     * @return array<string, string|null>
     */
    public function toArray(): array
    {
        $hasBreed = null !== $this->breed && '' !== trim($this->breed);

        return [
            'petType' => $this->petType,
            'petName' => trim($this->petName),
            'breed' => $hasBreed ? trim($this->breed) : null,
            'breedFallback' => $this->breedFallback,
            'mixDescription' => 'mix' === $this->breedFallback ? (trim((string) $this->mixDescription) ?: null) : null,
            'gender' => $this->gender,
        ];
    }
}

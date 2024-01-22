<?php declare(strict_types=1);

namespace App\Controller\Api\v1;

use App\Request\PetCreationRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

final class PetController extends AbstractController
{
    /**
     * Validates a pet registration and echoes back the normalised record.
     * Nothing is stored: the exercise ends at a validated submission.
     */
    #[Route('/api/v1/pet', name: 'api_v1_pet_create', methods: ['POST'], format: 'json')]
    public function create(#[MapRequestPayload] PetCreationRequest $request): JsonResponse
    {
        return new JsonResponse(
            ['message' => 'Pet registered.', 'pet' => $request->toArray()],
            Response::HTTP_CREATED,
        );
    }
}

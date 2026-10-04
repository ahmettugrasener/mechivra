export const REACTION_ARROW_MIN_LENGTH =
  20;

export const REACTION_ARROW_MAX_LENGTH =
  76;

export interface ReactionArrowVisual {
  readonly magnitudeRatio:
    number;

  readonly arrowLength:
    number;
}

export class ReactionVisualError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "ReactionVisualError";
  }
}

/**
 * Maps a non-negative support reaction to a
 * qualitative SVG arrow length.
 *
 * The arrow is a visual magnitude indicator,
 * not a physical length scale.
 */
export function createReactionArrowVisual(
  reactionKN: number,
  totalVerticalLoadKN: number,
): ReactionArrowVisual {
  if (
    !Number.isFinite(
      reactionKN,
    ) ||
    reactionKN < 0
  ) {
    throw new ReactionVisualError(
      "Reaction magnitude must be a finite non-negative number.",
    );
  }

  if (
    !Number.isFinite(
      totalVerticalLoadKN,
    ) ||
    totalVerticalLoadKN < 0
  ) {
    throw new ReactionVisualError(
      "Total vertical load must be a finite non-negative number.",
    );
  }

  if (
    totalVerticalLoadKN === 0
  ) {
    return {
      magnitudeRatio: 0,
      arrowLength: 0,
    };
  }

  const rawRatio =
    reactionKN /
    totalVerticalLoadKN;

  const magnitudeRatio =
    Math.min(
      1,
      Math.max(
        0,
        rawRatio,
      ),
    );

  const arrowLength =
    reactionKN === 0
      ? 0
      : REACTION_ARROW_MIN_LENGTH +
        (
          REACTION_ARROW_MAX_LENGTH -
          REACTION_ARROW_MIN_LENGTH
        ) *
          magnitudeRatio;

  return {
    magnitudeRatio,
    arrowLength,
  };
}
import type {
  SupportedLocale,
} from "@/domain/shared/types";

interface OttoTemperatureStateDiagramProps {
  readonly temperaturesK: {
    readonly state1:
      number;

    readonly state2:
      number;

    readonly state3:
      number;

    readonly state4:
      number;
  };

  readonly locale:
    SupportedLocale;
}

export function OttoTemperatureStateDiagram({
  temperaturesK,
  locale,
}: OttoTemperatureStateDiagramProps) {
  const states = [
    {
      id:
        1,

      value:
        temperaturesK.state1,
    },

    {
      id:
        2,

      value:
        temperaturesK.state2,
    },

    {
      id:
        3,

      value:
        temperaturesK.state3,
    },

    {
      id:
        4,

      value:
        temperaturesK.state4,
    },
  ] as const;

  const maximumTemperatureK =
    Math.max(
      ...states.map(
        (state) =>
          state.value,
      ),
    );

  const formatter =
    new Intl.NumberFormat(
      locale === "tr"
        ? "tr-TR"
        : "en-US",
      {
        maximumFractionDigits:
          3,
      },
    );

  const plotTop =
    40;

  const plotBottom =
    330;

  const plotHeight =
    plotBottom -
    plotTop;

  return (
    <figure
      data-testid="otto-temperature-state-diagram"
      className="overflow-hidden rounded-xl border border-border bg-background"
    >
      <svg
        role="img"
        aria-label={
          locale === "tr"
            ? "İdeal Otto çevrimi durum sıcaklıkları"
            : "Ideal Otto cycle state temperatures"
        }
        viewBox="0 0 800 410"
        className="block h-auto w-full"
      >
        <title>
          {locale === "tr"
            ? "İdeal Otto çevrimi durum sıcaklıkları"
            : "Ideal Otto cycle state temperatures"}
        </title>

        <line
          x1="80"
          y1={
            plotBottom
          }
          x2="740"
          y2={
            plotBottom
          }
          stroke="currentColor"
          strokeWidth="2"
          className="text-border-strong"
        />

        {states.map(
          (
            state,
            index,
          ) => {
            const x =
              150 +
              index *
                170;

            const height =
              (
                state.value /
                (
                  maximumTemperatureK *
                  1.08
                )
              ) *
              plotHeight;

            const y =
              plotBottom -
              height;

            return (
              <g
                key={
                  state.id
                }
                data-temperature-state={
                  state.id
                }
                data-temperature-k={
                  state.value
                }
              >
                <rect
                  x={
                    x -
                    38
                  }
                  y={y}
                  width="76"
                  height={
                    height
                  }
                  rx="8"
                  fill="currentColor"
                  className="text-brand"
                  opacity="0.18"
                />

                <line
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={
                    plotBottom
                  }
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-brand"
                />

                <circle
                  cx={x}
                  cy={y}
                  r="7"
                  fill="currentColor"
                  className="text-brand"
                />

                <text
                  x={x}
                  y={
                    y -
                    14
                  }
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="16"
                  fontWeight="700"
                  className="text-foreground"
                >
                  {formatter.format(
                    state.value,
                  )}{" "}
                  K
                </text>

                <text
                  x={x}
                  y="365"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="17"
                  fontWeight="700"
                  className="text-foreground"
                >
                  {locale === "tr"
                    ? `Durum ${state.id}`
                    : `State ${state.id}`}
                </text>
              </g>
            );
          },
        )}

        <text
          x="24"
          y="190"
          transform="rotate(-90 24 190)"
          textAnchor="middle"
          fill="currentColor"
          fontSize="16"
          fontWeight="600"
          className="text-foreground"
        >
          {locale === "tr"
            ? "Mutlak sıcaklık, T (K)"
            : "Absolute temperature, T (K)"}
        </text>
      </svg>

      <figcaption className="border-t border-border px-4 py-3 text-xs leading-5 text-muted">
        {locale === "tr"
          ? "Grafik mutlak sıcaklıkları karşılaştırır. Durum numaraları p–v diyagramındaki aynı termodinamik durumları temsil eder."
          : "The chart compares absolute temperatures. State numbers refer to the same thermodynamic states shown in the p–v diagram."}
      </figcaption>
    </figure>
  );
}
export const DURATIONS = [5, 10, 16, 30];

export interface LiquidiumLoan {
  id: string;
  accepted_date: string;
  principal_amount_sats: number;
  lender_id: string;
  borrower_id: string;
  duration: number; // Injected
}

type LiquidiumLoanApi = Omit<LiquidiumLoan, "duration">;

export async function fetchLiquidiumActiveLoans(): Promise<LiquidiumLoan[]> {
  try {
    const requests = DURATIONS.map((d) =>
      (() => {
        const url = `https://app.liquidium.wtf/api/collections/order-book/bitcoin-puppets-[${d}]-instant`;
        return fetch(url, {
          headers: {
            Referer: "https://app.liquidium.wtf/borrow/ordinals",
          },
          cf: {
            cacheEverything: true,
            cacheTtlByStatus: {
              "200-299": 600,
              "400-599": 0,
            },
          },
        }).then(async (res) => {
          if (!res.ok) {
            let bodyText = "";
            try {
              bodyText = await res.text();
            } catch {
              bodyText = "";
            }
            console.warn(
              `Liquidium loan fetch failed for duration ${d} (${res.status} ${res.statusText})${bodyText ? `: ${bodyText}` : ""}`,
            );
            return [];
          }

          let parsed: unknown;
          try {
            parsed = await res.json();
          } catch (error) {
            console.warn(
              `Liquidium loan JSON parse failed for duration ${d} at ${url}:`,
              error,
            );
            return [];
          }

          if (!parsed || typeof parsed !== "object") {
            console.warn(
              `Liquidium loan response is not an object for duration ${d} at ${url}.`,
            );
            return [];
          }

          const data = parsed as { loans?: LiquidiumLoanApi[] };
          if (!Array.isArray(data.loans)) {
            console.warn(
              `Liquidium loan response missing loans array for duration ${d} at ${url}.`,
            );
            return [];
          }

          return data.loans.map((loan) => ({
            id: loan.id,
            accepted_date: loan.accepted_date,
            principal_amount_sats: loan.principal_amount_sats,
            lender_id: loan.lender_id,
            borrower_id: loan.borrower_id,
            duration: d,
          }));
        });
      })(),
    );

    const results = await Promise.all(requests);
    return results.flat();
  } catch (error) {
    console.error("Error in fetchLiquidiumActiveLoans:", error);
    return [];
  }
}

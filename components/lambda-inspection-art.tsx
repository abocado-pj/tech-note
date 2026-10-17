import type { LambdaInspectionKind } from "@/lib/lambda-inspection";
import { CabinetMechanism } from "./cabinet-and-film";

export function LambdaInspectionDevice({
  kind,
}: {
  kind: LambdaInspectionKind;
}) {
  return (
    <div
      className={`inspection-device inspection-device--${kind}`}
      aria-hidden="true"
    >
      <div className="inspection-device__arch" />
      <div className="inspection-device__parts">
        <CabinetMechanism id={kind === "entry" ? "api-gateway" : "iam"} />
        <span className="inspection-device__joint" />
        <CabinetMechanism id={kind === "entry" ? "lambda" : "s3"} />
      </div>
      <div className="inspection-device__base">
        <i />
        <span>
          {kind === "entry" ? "INPUT / RUNTIME" : "PRINCIPAL / RESOURCE"}
        </span>
        <i />
      </div>
    </div>
  );
}

export const LAMBDA_SERIES_SLUG = "lambda-api-boundaries";
export const LAMBDA_SERIES_URL = `/series/${LAMBDA_SERIES_SLUG}`;
export const LAMBDA_BOOK_URL = `/books/${LAMBDA_SERIES_SLUG}`;

export const LAMBDA_BOUNDARIES = [
  {
    id: "entry",
    number: "I",
    label: "HTTPの入口",
    detail: "要求をイベントへ変換する",
  },
  {
    id: "execution",
    number: "II",
    label: "コードの実行",
    detail: "配置したJavaScriptを動かす",
  },
  {
    id: "role",
    number: "III",
    label: "AWSへの権限",
    detail: "関数が資源を操作できるか",
  },
  {
    id: "authorization",
    number: "IV",
    label: "利用者の認可",
    detail: "その対象を返してよいか",
  },
] as const;

export type LambdaBoundary = (typeof LAMBDA_BOUNDARIES)[number]["id"];
export type LambdaInspectionKind = "entry" | "authorization";

export const LAMBDA_INSPECTIONS = [
  {
    slug: "aws/lambda/typescript-handler-and-api-entry",
    number: "01",
    kind: "entry",
    label: "入口と実行の点検票",
    focus: "HTTPの要求と、実行されるコードを分ける。",
    boundaries: ["entry", "execution"],
    checks: ["API Gatewayが渡すイベント", "配置するJavaScriptとhandler設定"],
    note: "TypeScriptの型検査は実行前の工程です。ブラウザからソースをimportしてLambdaを動かす構成ではありません。",
  },
  {
    slug: "aws/iam/execution-role-and-user-authorization",
    number: "02",
    kind: "authorization",
    label: "主体と認可の点検票",
    focus: "関数の権限と、利用者へ返す判断を分ける。",
    boundaries: ["role", "authorization"],
    checks: ["実行ロールの信頼と操作権限", "文書と利用者の関係・拒否時の処理"],
    note: "関数がS3を読めても、利用者へ文書を返せるとは限りません。本文の例では、対象の認可を終えてからS3を読みます。",
  },
] as const;

export type LambdaInspection = (typeof LAMBDA_INSPECTIONS)[number];

export function getLambdaInspection(slug: string) {
  return LAMBDA_INSPECTIONS.find((inspection) => inspection.slug === slug);
}

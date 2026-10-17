import { Fragment } from "react";

// These phrases only control line breaks; the published titles stay unchanged.
const titlePhrases: Record<string, readonly string[]> = {
  "Lambda APIを入口と権限から読む": [
    "Lambda APIを",
    "入口と権限から読む",
  ],
  "Lambda APIの入口と権限を分ける": [
    "Lambda APIの",
    "入口と権限を",
    "分ける",
  ],
  "LambdaのAPI入口とTypeScriptの実行を分けて考える": [
    "Lambdaの",
    "API入口と",
    "TypeScriptの",
    "実行を",
    "分けて考える",
  ],
  "Lambdaの実行ロールと利用者の閲覧権限を分ける": [
    "Lambdaの",
    "実行ロールと",
    "利用者の",
    "閲覧権限を分ける",
  ],
  "HTTPの入口と、配置したコードの実行": [
    "HTTPの入口と、",
    "配置したコードの実行",
  ],
  "利用者の認可と、AWS側のアクセス評価": [
    "利用者の認可と、",
    "AWS側の",
    "アクセス評価",
  ],
  "HTTPリクエスト": ["HTTP", "リクエスト"],
  "Lambdaのhandler": ["Lambdaの", "handler"],
  "認証済みの利用者": ["認証済みの", "利用者"],
  "アプリで対象を認可": ["アプリで", "対象を認可"],
  "許可した場合にS3を読む": ["許可した場合", "にS3を読む"],
};

export function InspectionTitle({ title }: { title: string }) {
  const phrases = titlePhrases[title];
  if (!phrases) return title;

  return phrases.map((phrase, index) => (
    <Fragment key={phrase}>
      {index > 0 ? <wbr /> : null}
      <span className="inspection-title-phrase">{phrase}</span>
    </Fragment>
  ));
}

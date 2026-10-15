export type WorldId = "formats" | "oss" | "aws" | "network" | "git" | "database";
export type Specimen = { source: WorldId; crop: [number, number, number, number] };
export type WorldObject = {
  id: string;
  label: string;
  detail: string;
  articles: string[];
  specimen?: Specimen;
  related?: boolean;
};
export type ReadingWorld = {
  id: WorldId;
  title: string;
  subtitle: string;
  instruction: string;
  groups: { name: string; objects: WorldObject[] }[];
};

const object = (id: string, label: string, detail: string, articles: string[], source: WorldId, crop: Specimen["crop"], related = false): WorldObject => ({ id, label, detail, articles, specimen: { source, crop }, related });
const format = (id: string, label: string, detail: string, crop: Specimen["crop"], published = true) => object(id, label, detail, published ? [`file-formats/extensions/${id}`] : [], "formats", crop);

export const READING_WORLDS: ReadingWorld[] = [
  {
    id: "formats", title: "拡張子の作業机", subtitle: "ファイルのかたちから、つくる楽しさを見つけよう。", instruction: "道具に触れて、形式を知る",
    groups: [{ name: "机の上の道具", objects: [
      format("jpeg", "JPEG", "写真を記録する画像形式。この記事は準備中です。", [96, 336, 274, 140], false),
      format("png", "PNG", "透過も扱うラスター画像。この記事は準備中です。", [180, 621, 154, 130], false),
      format("svg", "SVG", "座標と図形で描く、拡大できる画像。", [582, 515, 244, 207]),
      format("json", "JSON", "通信データを、オブジェクトや配列で表す。", [660, 236, 159, 167]),
      format("yaml", "YAML", "設定を、字下げとキー・値で読み解く。", [830, 245, 148, 168]),
      format("xlsx", "XLSX", "表計算のブック。この記事は準備中です。", [1020, 310, 390, 245], false),
      format("csv", "CSV / TSV", "区切り文字と、列の意味を分けて読む。", [972, 595, 277, 165]),
      format("zip", "ZIP", "ファイルをまとめる圧縮形式。この記事は準備中です。", [1353, 532, 181, 227], false),
    ] }],
  },
  {
    id: "oss", title: "OSS解剖学", subtitle: "部品を外して、コードの奥へ。", instruction: "部品を選び、観察する場所を決める",
    groups: [{ name: "分解する機構", objects: [
      object("entry", "入口", "公開APIと呼び出しの境界を観察する。OSS実装を追う記事は準備中です。", [], "oss", [25, 104, 351, 422]),
      object("parser", "構文解析", "文字列から構造をつくる部品。解説記事は準備中です。", [], "oss", [452, 198, 262, 225]),
      object("internals", "内部構造", "既存記事で、APIの名前と実行時の状態の違いを読む。特定OSSの解剖記事ではありません。", ["architecture/execution-model/framework-api-abstraction-leaks"], "oss", [737, 224, 229, 360], true),
      object("tests", "テスト", "既存のRSpec記事へ。何を実物で確かめ、どこを置き換えるかを読む。", ["rails/rspec/real-vs-mock-boundary", "rails/rspec/request-spec-vs-controller-spec"], "oss", [963, 237, 224, 368], true),
      object("dependencies", "依存関係", "部品同士の契約を追う。OSSの依存関係を解剖する記事は準備中です。", [], "oss", [1190, 245, 319, 453]),
    ] }],
  },
  {
    id: "aws", title: "AWS機構図鑑", subtitle: "クラウドの働きを、ひとつずつ解き明かす。", instruction: "気になる機構を選んで、内部を見る",
    groups: [
      { name: "計算と実行", objects: [
        object("ec2", "EC2", "仮想サーバー。解説記事は準備中です。", [], "aws", [42, 236, 167, 114]),
        object("ecs", "ECS", "コンテナの実行を管理する。解説記事は準備中です。", [], "aws", [44, 389, 164, 57]),
        object("eks", "EKS", "Kubernetesの管理サービス。解説記事は準備中です。", [], "aws", [55, 486, 144, 129]),
        object("lambda", "Lambda", "APIの入口と、handlerが動く条件を分けて読む。", ["aws/lambda/typescript-handler-and-api-entry"], "aws", [49, 652, 151, 62]),
      ] },
      { name: "保存とデータ", objects: [
        object("s3", "S3", "関連する既存記事で、S3とDBの更新境界・不整合の照合を読む。S3全般の解説ではありません。", ["rails/data/db-s3-transaction-boundary", "rails/data/s3-db-consistency-reconciliation"], "aws", [256, 247, 166, 92], true),
        object("ebs", "EBS", "ブロックストレージ。解説記事は準備中です。", [], "aws", [249, 386, 87, 97]),
        object("efs", "EFS", "共有ファイルストレージ。解説記事は準備中です。", [], "aws", [345, 382, 85, 103]),
        object("rds", "RDS", "リレーショナルDBの管理サービス。解説記事は準備中です。", [], "aws", [267, 498, 153, 68]),
        object("aurora", "Aurora", "クラウド向けのリレーショナルDB。解説記事は準備中です。", [], "aws", [275, 593, 144, 60]),
        object("dynamodb", "DynamoDB", "キーによるアクセスを設計するDB。解説記事は準備中です。", [], "aws", [261, 686, 166, 59]),
        object("elasticache", "ElastiCache", "インメモリのデータストア。解説記事は準備中です。", [], "aws", [263, 780, 162, 61]),
      ] },
      { name: "通信と配信", objects: [
        object("vpc", "VPC", "AWS内の論理ネットワーク。解説記事は準備中です。", [], "aws", [478, 254, 150, 96]),
        object("route53", "Route 53", "DNSサービス。解説記事は準備中です。", [], "aws", [489, 397, 126, 109]),
        object("cloudfront", "CloudFront", "コンテンツの配信。解説記事は準備中です。", [], "aws", [485, 534, 133, 104]),
        object("elb", "ELB", "複数の宛先への負荷分散。解説記事は準備中です。", [], "aws", [475, 677, 154, 64]),
        object("api-gateway", "API Gateway", "関連するLambda記事で、HTTPの入口からhandlerへ届くイベントを読む。", ["aws/lambda/typescript-handler-and-api-entry"], "aws", [474, 775, 150, 63], true),
      ] },
      { name: "認証と保護", objects: [
        object("iam", "IAM", "実行ロールと、利用者ごとの認可を区別する。", ["aws/iam/execution-role-and-user-authorization"], "aws", [700, 285, 110, 81]),
        object("cognito", "Cognito", "アプリ利用者の認証。解説記事は準備中です。", [], "aws", [708, 413, 104, 102]),
        object("kms", "KMS", "暗号鍵の管理。解説記事は準備中です。", [], "aws", [718, 563, 80, 100]),
        object("secrets-manager", "Secrets Manager", "シークレットの管理。解説記事は準備中です。", [], "aws", [714, 719, 95, 106]),
      ] },
      { name: "連携と制御", objects: [
        object("sqs", "SQS", "送り手と受け手の処理を切り離すメッセージキュー。解説本文は準備中です。", [], "aws", [862, 266, 174, 114]),
        object("sns", "SNS", "通知を購読先へ配信する。解説記事は準備中です。", [], "aws", [869, 412, 163, 97]),
        object("eventbridge", "EventBridge", "イベントをルールで振り分ける。解説記事は準備中です。", [], "aws", [879, 575, 151, 109]),
        object("step-functions", "Step Functions", "状態遷移で処理をつなぐ。解説記事は準備中です。", [], "aws", [879, 750, 151, 84]),
      ] },
      { name: "分析と観測", objects: [
        object("cloudwatch", "CloudWatch", "メトリクスとログを観測する。解説記事は準備中です。", [], "aws", [1093, 280, 138, 88]),
        object("cloudtrail", "CloudTrail", "AWS上の操作を記録する。解説記事は準備中です。", [], "aws", [1097, 424, 126, 65]),
        object("athena", "Athena", "S3上のデータへクエリする。解説記事は準備中です。", [], "aws", [1115, 551, 100, 91]),
        object("glue", "Glue", "データの統合とカタログ。解説記事は準備中です。", [], "aws", [1101, 672, 118, 69]),
        object("redshift", "Redshift", "分析向けデータウェアハウス。解説記事は準備中です。", [], "aws", [1098, 772, 128, 64]),
      ] },
    ],
  },
  {
    id: "network", title: "ネットワークの交換局", subtitle: "名前を引き、通信し、安全に届ける。", instruction: "つまみを選び、通信の役割をたどる",
    groups: [{ name: "交換盤", objects: [
      object("dns", "DNS", "名前から接続先を調べる。解説記事は準備中です。", [], "network", [50, 204, 258, 276]),
      object("http", "HTTP", "リクエストとレスポンスでやり取りする。関連するAPI入口の記事を読めます。", ["aws/lambda/typescript-handler-and-api-entry"], "network", [342, 193, 282, 62], true),
      object("tls", "TLS", "通信を保護する仕組み。既存記事は認証方式の整理で、TLS自体の解説ではありません。", ["architecture/auth/authentication-types"], "network", [686, 201, 183, 301], true),
      object("tcp", "TCP", "順序と再送などでデータの到達を扱う。解説記事は準備中です。", [], "network", [946, 226, 267, 249]),
      object("cdn", "CDN", "コンテンツを配信する。解説記事は準備中です。", [], "network", [1250, 212, 229, 322]),
    ] }],
  },
  {
    id: "git", title: "Gitの編集室", subtitle: "変更を見比べる。履歴を、意図のある一本へ。", instruction: "フィルムを送り、変更をたどる",
    groups: [{ name: "編集台のフィルム", objects: [
      object("commit", "commit", "変更をどの単位で残すか。GitHubのマージ方式を比べる。", ["github/pull-request/merge-methods"], "git", [20, 614, 388, 92], true),
      object("branch", "branch", "switchとcheckoutで、切り替えとファイル復元を区別する。", ["git/commands/switch-checkout"], "git", [788, 580, 352, 68]),
      object("rebase", "rebase", "Squash後に、履歴の違いが競合へつながる条件を確かめる。", ["git/merge/squash-merge-rebase-conflict"], "git", [853, 668, 364, 70]),
      object("merge", "merge", "残したい履歴から、GitHubのマージ方式を選ぶ。", ["github/pull-request/merge-methods"], "git", [1257, 642, 277, 84]),
    ] }],
  },
  {
    id: "database", title: "データベースの地下施設", subtitle: "表の向こうへ。問い合わせが届く場所を探る。", instruction: "施設の層を選び、内部を読む",
    groups: [{ name: "地下施設の断面", objects: [
      object("tables", "テーブル", "View・派生テーブル・CTE・一時テーブルで、何が残るかを読む。", ["sql/internal/view-derived-table-cte-temporary-table"], "database", [40, 87, 490, 352]),
      object("indexes", "インデックス", "EXPLAINの記事で、計画に現れるアクセス方法を確かめる。インデックス専用記事ではありません。", ["sql/internal/explain-analyze"], "database", [872, 318, 328, 148], true),
      object("transactions", "トランザクション", "DBの更新と外部ストレージを、どこまで一緒に戻せるか。", ["rails/data/db-s3-transaction-boundary"], "database", [471, 465, 468, 292]),
      object("queries", "クエリ", "EXPLAINとEXPLAIN ANALYZEで、計画と実測を区別する。", ["sql/internal/explain-analyze"], "database", [1036, 504, 346, 317]),
    ] }],
  },
];

export const getReadingWorld = (id: string) => READING_WORLDS.find((world) => world.id === id);
export function getArticleWorld(slug: string): ReadingWorld | undefined {
  const id = slug.startsWith("file-formats/") ? "formats"
    : slug.startsWith("aws/") ? "aws"
    : /^(git|github)\//.test(slug) ? "git"
    : /^(sql\/|rails\/sql\/|rails\/data\/db-s3|rails\/data\/s3-db)/.test(slug) ? "database"
    : slug.startsWith("rails/rspec/") ? "oss"
    : slug === "architecture/auth/authentication-types" ? "network" : undefined;
  return id ? getReadingWorld(id) : undefined;
}

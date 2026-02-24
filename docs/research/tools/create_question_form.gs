/**
 * 「おかもん先生に聞いてみたい！」Googleフォーム自動生成スクリプト
 *
 * 使い方:
 * 1. https://script.google.com にアクセス
 * 2. 「新しいプロジェクト」を作成
 * 3. このコードを貼り付け
 * 4. ▶ 実行ボタンを押す（関数: createQuestionForm）
 * 5. 初回はGoogleアカウントの権限許可が必要
 * 6. 実行ログにフォームURLとスプレッドシートURLが表示される
 */

function createQuestionForm() {
  // ── フォーム作成 ──
  var form = FormApp.create("おかもん先生に聞いてみたい！");

  form.setDescription(
    "愛育病院小児科のおかもん先生が、みなさまのギモンにお答えします。\n" +
    "「こんなこと聞いていいのかな？」というご質問こそ大歓迎です。\n\n" +
    "・お寄せいただいたご質問は、メルマガ「小児科おかもん だより」の\n" +
    "　【読者のギモン回答】コーナーで取り上げさせていただくことがあります。\n" +
    "・個人が特定される情報は掲載しません。\n" +
    "・すべてのご質問に個別にお答えすることは難しい場合がございます。\n" +
    "・緊急性のあるご相談は、外来受診または #8000 にお電話ください。"
  );

  form.setConfirmationMessage(
    "ご質問ありがとうございます！\n" +
    "おかもん先生が確認させていただきます。\n\n" +
    "メルマガで取り上げさせていただく場合がありますので、\n" +
    "楽しみにお待ちください。\n\n" +
    "※ 緊急のご相談は外来受診または #8000 にお電話ください。"
  );

  form.setCollectEmail(false);
  form.setAllowResponseEdits(false);
  form.setLimitOneResponsePerUser(false);

  // ── 項目1: ペンネーム ──
  var penName = form.addTextItem();
  penName.setTitle("ペンネーム");
  penName.setHelpText("「匿名希望」でもOKです");
  penName.setRequired(true);

  // ── 項目2: お子さんの月齢・年齢 ──
  var age = form.addListItem();
  age.setTitle("お子さんの月齢・年齢");
  age.setHelpText("一番近いものをお選びください");
  age.setChoices([
    age.createChoice("妊娠中"),
    age.createChoice("0〜1ヶ月"),
    age.createChoice("2〜3ヶ月"),
    age.createChoice("4〜6ヶ月"),
    age.createChoice("7〜11ヶ月"),
    age.createChoice("1歳"),
    age.createChoice("2歳"),
    age.createChoice("3歳以上"),
    age.createChoice("複数のお子さんがいる")
  ]);
  age.setRequired(true);

  // ── 項目3: ご質問の内容 ──
  var question = form.addParagraphTextItem();
  question.setTitle("ご質問の内容");
  question.setHelpText("気になっていること、聞きたいことを自由にお書きください");
  question.setRequired(true);

  // ── 項目4: カテゴリ ──
  var category = form.addCheckboxItem();
  category.setTitle("質問のカテゴリ（あてはまるものすべて）");
  category.setHelpText("わからなければ選ばなくてOKです");
  category.setChoices([
    category.createChoice("感染症（風邪・インフル・ノロなど）"),
    category.createChoice("スキンケア・湿疹"),
    category.createChoice("アレルギー・食物アレルギー"),
    category.createChoice("予防接種・ワクチン"),
    category.createChoice("発達・成長"),
    category.createChoice("睡眠・夜泣き"),
    category.createChoice("栄養・離乳食・母乳/ミルク"),
    category.createChoice("受診の判断・救急"),
    category.createChoice("その他")
  ]);
  category.setRequired(false);

  // ── 項目5: 掲載許可 ──
  var permission = form.addMultipleChoiceItem();
  permission.setTitle("メルマガへの掲載について");
  permission.setHelpText("ご質問をメルマガで紹介させていただく場合の許可をお選びください");
  permission.setChoices([
    permission.createChoice("ペンネームで掲載OK"),
    permission.createChoice("匿名（ペンネームも非公開）で掲載OK"),
    permission.createChoice("掲載不可（個別にメールで回答を希望）")
  ]);
  permission.setRequired(true);

  // ── 項目6: メールアドレス（任意） ──
  var email = form.addTextItem();
  email.setTitle("メールアドレス（任意）");
  email.setHelpText("個別回答を希望される場合のみご記入ください");
  email.setRequired(false);

  // ── スプレッドシート連携 ──
  var ss = SpreadsheetApp.create("おかもん だより 質問管理シート");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // ── 管理用シートを追加 ──
  var mgmtSheet = ss.insertSheet("管理ステータス");
  mgmtSheet.getRange("A1:F1").setValues([[
    "タイムスタンプ", "ペンネーム", "質問（冒頭30字）", "ステータス", "掲載号", "メモ"
  ]]);
  mgmtSheet.getRange("A1:F1").setFontWeight("bold");
  mgmtSheet.setColumnWidth(1, 150);
  mgmtSheet.setColumnWidth(2, 100);
  mgmtSheet.setColumnWidth(3, 250);
  mgmtSheet.setColumnWidth(4, 100);
  mgmtSheet.setColumnWidth(5, 80);
  mgmtSheet.setColumnWidth(6, 200);

  // ステータスのデータ入力規則
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["未対応", "検討中", "掲載予定", "掲載済", "個別回答済", "対象外"])
    .build();
  mgmtSheet.getRange("D2:D500").setDataValidation(statusRule);

  // ── 結果出力 ──
  var formUrl = form.getPublishedUrl();
  var editUrl = form.getEditUrl();
  var ssUrl = ss.getUrl();

  Logger.log("✅ フォーム作成完了！");
  Logger.log("");
  Logger.log("📋 フォームURL（読者に共有）: " + formUrl);
  Logger.log("✏️ フォーム編集URL: " + editUrl);
  Logger.log("📊 スプレッドシートURL: " + ssUrl);
  Logger.log("");
  Logger.log("次のステップ:");
  Logger.log("1. フォームURLをbit.lyなどで短縮");
  Logger.log("2. QRコード生成（https://qr.codes など）");
  Logger.log("3. メルマガ記事末尾のCTAにURLを挿入");
  Logger.log("4. 待合室掲示物にQRコードを印刷");
}

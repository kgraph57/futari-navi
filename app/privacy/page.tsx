import type { Metadata } from "next"
import { SectionHeading } from "@/components/shared/section-heading"

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "すくすくナビにおける個人情報の取り扱いについて説明しています。",
}

const SECTIONS = [
  {
    title: "1. 基本方針",
    content:
      "すくすくナビ（以下「当サイト」）は、利用者のプライバシーを尊重し、個人情報の保護に努めます。本ポリシーは、当サイトにおける個人情報の取り扱いについて説明するものです。",
  },
  {
    title: "2. 収集する情報",
    items: [
      "お問い合わせフォームに入力されたお名前・メールアドレス・お問い合わせ内容",
      "メールマガジン登録時のメールアドレス",
      "アクセス解析ツール（Google Analytics等）によるアクセスログ情報（IPアドレス、ブラウザ情報、閲覧ページ等）",
      "Cookie（クッキー）によるサイト利用状況の情報",
    ],
  },
  {
    title: "3. 利用目的",
    items: [
      "お問い合わせへの回答・対応",
      "メールマガジンの配信",
      "サイトの利用状況の分析・改善",
      "コンテンツの品質向上",
    ],
  },
  {
    title: "4. 第三者への提供",
    content:
      "当サイトは、法令に基づく場合を除き、利用者の同意なく個人情報を第三者に提供することはありません。ただし、アクセス解析のためにGoogle Analyticsを使用しており、Googleのデータ収集・処理に関してはGoogleのプライバシーポリシーが適用されます。",
  },
  {
    title: "5. Cookie（クッキー）について",
    content:
      "当サイトでは、利用者の利便性向上やアクセス解析のためにCookieを使用することがあります。ブラウザの設定によりCookieを無効にすることが可能ですが、一部の機能が利用できなくなる場合があります。",
  },
  {
    title: "6. 医療情報の取り扱い",
    content:
      "当サイトは一般的な医学知識の提供を目的としています。利用者の個別の健康状態や病歴に関する情報を収集・保存することはありません。サイト上で提供される情報は、医師の診察や専門的な医療アドバイスに代わるものではありません。",
  },
  {
    title: "7. セキュリティ",
    content:
      "当サイトは、個人情報の漏洩・滅失・毀損を防止するため、適切なセキュリティ対策を講じています。SSL/TLS暗号化通信を使用し、データの安全な送受信を行っています。",
  },
  {
    title: "8. お子さまの個人情報",
    content:
      "当サイトは、16歳未満のお子さまから直接個人情報を収集することを意図していません。保護者の方がお問い合わせをされる場合は、お子さまの個人情報（氏名・具体的な症状等）の記載は避けていただくようお願いいたします。",
  },
  {
    title: "9. 個人情報の開示・訂正・削除",
    content:
      "利用者ご本人から個人情報の開示・訂正・削除のご請求があった場合は、本人確認を行ったうえで、合理的な範囲で速やかに対応いたします。",
  },
  {
    title: "10. 免責事項",
    items: [
      "当サイトの情報は一般的な医学知識の提供を目的としており、個別の診断・治療を行うものではありません",
      "情報の正確性には最大限注意を払っていますが、内容を保証するものではありません",
      "当サイトのリンク先における個人情報の取り扱いについては、当サイトは責任を負いません",
    ],
  },
  {
    title: "11. ポリシーの変更",
    content:
      "本ポリシーは、法令の改正やサイト運営方針の変更に伴い、予告なく改定する場合があります。変更後のポリシーは当ページにて公開します。",
  },
  {
    title: "12. お問い合わせ",
    content:
      "プライバシーポリシーに関するお問い合わせは、お問い合わせページよりご連絡ください。",
  },
] as const

export default function PrivacyPage() {
  return (
    <div className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionHeading>プライバシーポリシー</SectionHeading>
        <p className="mt-4 text-center text-sm text-muted">
          最終更新日: 2026年2月17日
        </p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {section.title}
              </h2>
              {"content" in section && section.content && (
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {section.content}
                </p>
              )}
              {"items" in section && section.items && (
                <ul className="mt-3 space-y-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-relaxed text-muted"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-ivory-100 p-6">
          <p className="text-sm leading-relaxed text-muted">
            本ポリシーについてご不明な点がございましたら、
            <a
              href="/contact"
              className="font-medium text-sage-600 underline transition-colors hover:text-sage-700"
            >
              お問い合わせページ
            </a>
            よりご連絡ください。
          </p>
        </div>
      </div>
    </div>
  )
}

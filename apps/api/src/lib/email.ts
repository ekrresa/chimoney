import postmark from 'postmark'
import { renderAsync } from '@react-email/render'

import { env } from '@/env'
import WelcomeEmail from 'transactional/emails/WelcomeEmail'

const emailClient = new postmark.ServerClient(env.POSTMARK_API_KEY)

type WelcomeEmailInput = {
  code: string
  name: string
  email: string
}
export async function sendWelcomeEmail(input: WelcomeEmailInput) {
  const { code, name, email } = input

  const emailHtml = await renderAsync(WelcomeEmail({ code, name }))

  const options = {
    From: 'peercash@ekrresa.com',
    To: email,
    Subject: 'Welcome to PeerCash',
    HtmlBody: emailHtml,
  }

  emailClient.sendEmail(options)
}

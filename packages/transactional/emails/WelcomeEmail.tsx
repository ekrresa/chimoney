import {
  Body,
  Container,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

type Props = {
  name: string
  code: string
}
export const WelcomeEmail = (props: Props) => {
  const { name, code } = props

  return (
    <Html>
      <Preview>Welcome to PeerCash</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-full max-w-[465px] p-[20px]">
            <Section>
              <Text className="text-2xl font-semibold">Welcome to PeerCash</Text>
              <Hr />
            </Section>

            <Text className="text-base">Hi {name},</Text>
            <Text className="text-base">
              Thanks for trying our product. We are thrilled to have you on board.
            </Text>
            <Text className="text-base">
              To verify your email address, please copy the code below:
            </Text>

            <Section>
              <Text className="text-center font-mono text-2xl">{code}</Text>
            </Section>

            <Section>
              <Text className="text-base">
                The code expires in 24 hours and can only be used once.
              </Text>
              <Text className="text-base">Thanks!</Text>
              <Text className="text-base">PeerCash!</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default WelcomeEmail

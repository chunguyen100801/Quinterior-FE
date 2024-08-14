'use client';
import LoginForm from '@/app/auth/components/login-form';
import SignUpForm from '@/app/auth/components/signup-form';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
export default function AuthTab() {
  return (
    <Tabs aria-label="Options ">
      <Tab key="login" title="Login">
        <Card
          isBlurred
          radius="lg"
          className="  relative flex h-[100%]  w-full items-center justify-center bg-background/60 p-[2rem]  dark:bg-default-100/50  xl:w-[30rem]"
        >
          <CardBody>
            <LoginForm></LoginForm>
          </CardBody>
        </Card>
      </Tab>

      <Tab key="signup" title="Signup">
        <Card
          isBlurred
          radius="lg"
          className="  relative flex h-[100%]  w-full items-center justify-center bg-background/60 p-[2rem]  dark:bg-default-100/50  xl:w-[30rem]"
        >
          <CardBody>
            <SignUpForm></SignUpForm>
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  );
}

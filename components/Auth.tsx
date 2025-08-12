'use client';

import { PasswordInput } from '@/components/ui/password-input';
import { apiFetch } from '@/helpers/fetch';
import { Alert, Button, Field, Input } from '@chakra-ui/react';
import { FormEventHandler, useCallback, useEffect, useState } from 'react';

type AuthProps = {
  createAccount?: boolean;
  redirectTo?: string;
};

export const Auth = ({ createAccount, redirectTo }: AuthProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');

  const isValid = useCallback(() => {
    const isValidUsername = /[a-zA-Z0-9_]{5,30}/.test(username);
    setUsernameError(
      isValidUsername
        ? ''
        : 'Usernames must be between 5 and 30 characters and only contain letters, numbers, and underscores.',
    );

    const isValidEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(
      email,
    );
    setEmailError(isValidEmail ? '' : 'Enter a valid email');

    return isValidUsername && (!createAccount || isValidEmail);
  }, [createAccount, email, username]);

  useEffect(() => {
    if (usernameError || emailError) {
      isValid();
    }
  }, [usernameError, isValid, emailError]);

  const onLogin: FormEventHandler = (e) => {
    e.preventDefault();
    if (!isLoading) {
      setIsLoading(true);
      setSubmitError('');
      if (isValid()) {
        const body: Record<string, string> = { username, password };
        if (createAccount) {
          body.email = email;
        }
        apiFetch(createAccount ? '/api/user' : '/api/authenticate', {
          method: 'POST',
          body: JSON.stringify(body),
        }).then(({ ok, data, error }) => {
          if (ok && data.authed) {
            if (createAccount) {
              window.location.assign(
                decodeURIComponent(redirectTo || '') || '/',
              );
            } else {
              window.location.reload();
            }
          } else {
            setSubmitError(error || 'Something went wrong. Please try again.');
          }
        });
      }
    }
  };

  const redirect = () => {
    if (createAccount) {
      window.location.assign(redirectTo || '/');
    } else {
      window.location.assign(
        `/signup${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
      );
    }
  };

  return (
    <form onSubmit={onLogin}>
      <div
        style={{
          height: '75vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'stretch',
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: '1rem',
            flexGrow: 1,
            maxWidth: '30rem',
          }}
        >
          {submitError && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Title>{submitError}</Alert.Title>
            </Alert.Root>
          )}
          {createAccount && (
            <Field.Root invalid={!!emailError}>
              <Field.Label>Email</Field.Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              <Field.ErrorText>{emailError}</Field.ErrorText>
            </Field.Root>
          )}
          <Field.Root invalid={!!usernameError}>
            <Field.Label>Username</Field.Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Field.ErrorText>{usernameError}</Field.ErrorText>
          </Field.Root>
          <Field.Root>
            <Field.Label>Password</Field.Label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field.Root>
          <Button
            variant="solid"
            type="submit"
            disabled={!username || !password || (createAccount && !email)}
            loading={isLoading}
          >
            {createAccount ? 'Create Account' : 'Login'}
          </Button>
          <Button variant="outline" onClick={redirect}>
            {createAccount ? 'Back to Login' : 'Create Account'}
          </Button>
        </div>
      </div>
    </form>
  );
};

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound, Mail, Mic } from 'lucide-react';

import { useAuth } from '@/components/auth-provider';
import { useApiKey } from '@/components/api-key-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export function Navbar() {
  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const {
    user,
    isLoading,
    signOut,
    signInWithPassword,
    signUpWithPassword,
    signInWithMagicLink,
  } = useAuth();
  const { toast } = useToast();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { apiKey, setApiKey, clearApiKey } = useApiKey();
  const [apiKeyDraft, setApiKeyDraft] = useState('');
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);

  const handleAuthError = (error: unknown, defaultMessage: string) => {
    const message =
      error && typeof error === 'object' && 'message' in error
        ? String((error as any).message)
        : defaultMessage;
    toast({
      title: 'Authentication error',
      description: message,
      variant: 'destructive',
    });
  };

  const handleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithPassword(email, password);
      setIsAuthOpen(false);
      setEmail('');
      setPassword('');
      toast({
        title: 'Signed in',
        description: 'You are now logged in.',
      });
    } catch (error) {
      handleAuthError(error, 'Unable to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async () => {
    setIsSubmitting(true);
    try {
      await signUpWithPassword(email, password);
      toast({
        title: 'Check your email',
        description: 'We have sent you a confirmation link.',
      });
    } catch (error) {
      handleAuthError(error, 'Unable to sign up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicLink = async () => {
    setIsSubmitting(true);
    try {
      await signInWithMagicLink(email);
      toast({
        title: 'Magic link sent',
        description: 'Check your inbox for a sign-in link.',
      });
    } catch (error) {
      handleAuthError(error, 'Unable to send magic link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      clearApiKey();
      toast({
        title: 'Signed out',
        description: 'You have been logged out.',
      });
    } catch (error) {
      handleAuthError(error, 'Unable to sign out. Please try again.');
    }
  };

  const handleSaveApiKey = () => {
    if (!apiKeyDraft.trim()) {
      toast({
        title: 'API key required',
        description: 'Please paste a valid API key.',
        variant: 'destructive',
      });
      return;
    }
    setApiKey(apiKeyDraft.trim());
    setIsApiKeyOpen(false);
    toast({
      title: 'API key saved',
      description: 'Your API key will be used for transcription requests.',
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Mic className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight">AUDIONIX</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <a
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How It Works
          </a>
          <a
            href="#demo"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Demo
          </a>
          <Link
            href="/docs"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            API Docs
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={scrollToDemo}
            size="sm"
            className="hidden rounded-full md:inline-flex"
          >
            Try the Demo
          </Button>
          <Dialog open={isApiKeyOpen} onOpenChange={setIsApiKeyOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
                disabled={isLoading}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                {apiKey ? 'Change API Key' : 'Set API Key'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set your API key</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Paste the API key for your Voice-to-Text backend. It will be stored only
                  in this browser session and sent with each transcription request.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    autoComplete="off"
                    value={apiKeyDraft}
                    onChange={(e) => setApiKeyDraft(e.target.value)}
                    placeholder="sk_..."
                  />
                </div>
                <div className="flex justify-between items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setApiKeyDraft('');
                      clearApiKey();
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    onClick={handleSaveApiKey}
                  >
                    Save API Key
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-muted-foreground md:inline-flex">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                disabled={isLoading}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isLoading}>
                  <Mail className="mr-2 h-4 w-4" />
                  Login / Sign up
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign in to transcribe audio</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="password">
                  <TabsList className="mb-4">
                    <TabsTrigger value="password">Email &amp; Password</TabsTrigger>
                    <TabsTrigger value="magic">Magic Link</TabsTrigger>
                  </TabsList>
                  <TabsContent value="password" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={handleSignIn}
                        disabled={isSubmitting || !email || !password}
                      >
                        Log in
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={handleSignUp}
                        disabled={isSubmitting || !email || !password}
                      >
                        Sign up
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="magic" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="magic-email">Email</Label>
                      <Input
                        id="magic-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleMagicLink}
                      disabled={isSubmitting || !email}
                    >
                      Send magic link
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </nav>
  );
}


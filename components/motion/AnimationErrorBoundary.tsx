'use client';

import { Component, ReactNode } from 'react';

interface AnimationErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/*
 * Wraps animation layers so a JS error in an animation component
 * doesn't break the page. Falls back to rendering children without animation.
 *
 * Applied around all animation wrappers in section components.
 */
export class AnimationErrorBoundary extends Component<AnimationErrorBoundaryProps, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // In production this would route to Sentry
    console.error('[AnimationErrorBoundary]', error);
  }

  render() {
    return this.props.children;
  }
}

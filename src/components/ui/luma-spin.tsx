"use client";

import React from 'react';
import styled, { keyframes } from 'styled-components';

const loaderAnim = keyframes`
  0% {
    inset: 0 35px 35px 0;
  }
  12.5% {
    inset: 0 35px 0 0;
  }
  25% {
    inset: 35px 35px 0 0;
  }
  37.5% {
    inset: 35px 0 0 0;
  }
  50% {
    inset: 35px 0 0 35px;
  }
  62.5% {
    inset: 0 0 0 35px;
  }
  75% {
    inset: 0 0 35px 35px;
  }
  87.5% {
    inset: 0 0 35px 0;
  }
  100% {
    inset: 0 35px 35px 0;
  }
`;

const StyledContainer = styled.div`
  position: relative;
  width: 40px;
  aspect-ratio: 1;
`;

const Span = styled.span<{ $delay?: boolean }>`
  position: absolute;
  border-radius: 50px;
  animation: ${loaderAnim} 2.5s infinite;
  box-shadow: inset 0 0 0 2px hsl(var(--primary));
  ${props => props.$delay && `animation-delay: -1.25s;`}
`;

export function LumaSpin() {
    return (
        <StyledContainer>
            <Span />
            <Span $delay />
        </StyledContainer>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="text-6xl mb-4">🎓</div>
        <h2 className="text-2xl font-semibold">Bonjour !</h2>
        <p className="text-muted-foreground">
          Je peux vous aider à choisir la filière qui correspond le mieux à vos
          aspirations à l'IUC.
        </p>
        <Button onClick={onStart} className="rounded-full px-6">
          Commencer l'orientation
        </Button>
      </div>
    </div>
  );
}

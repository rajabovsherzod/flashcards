// client/src/app/decks/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, BookOpen, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCreateDeckModal } from "@/hooks/use-create-deck-modal";
import { CreateDeckModal } from "@/components/decks/create-deck-modal";
import { CreateCardModal } from "@/components/cards/create-card-modal";
import { useGetAllDecks } from "@/hooks/use-get-all-deck";
import { Deck } from "@/lib/api/decks/deck.types";
import { ProtectedPage } from "@/app/auth/protected-page"; // 🚀 TO'G'RI PATH

interface DeckSettingsModalProps {
  deck: Deck | null;
  isOpen: boolean;
  onClose: () => void;
}

function DeckSettingsModal({ deck, isOpen, onClose }: DeckSettingsModalProps) {
  if (!isOpen || !deck) return null;

  const handleEdit = () => {
    console.log("Edit deck:", deck.id);
    onClose();
  };

  const handleDelete = () => {
    console.log("Delete deck:", deck.id);
    onClose();
  };

  return (
  
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg border shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Deck Settings</h3>
          <div className="mb-4">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">
              {deck.title}
            </h4>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="w-full justify-start"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Deck
            </Button>

            <Button
              onClick={handleDelete}
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Deck
            </Button>
          </div>

          <div className="flex gap-2 mt-6">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DecksPage() {
  const { onOpen } = useCreateDeckModal();
  const { data: decksResponse, isLoading, error } = useGetAllDecks();
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const decks = decksResponse?.data || [];

  const openSettingsModal = (deck: Deck) => {
    setSelectedDeck(deck);
    setIsSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
    setSelectedDeck(null);
  };

  return (
    <ProtectedPage requireAuth={true}>

      {isLoading && (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold mb-2 text-red-600">
                Error loading decks
              </h3>
              <p className="text-muted-foreground">
                Please try refreshing the page
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Decks</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your flashcard collections
                </p>
              </div>
              <Button onClick={onOpen} className="bg-teal-600 hover:bg-teal-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Deck
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {decks.map((deck) => (
                <Card
                  key={deck.id}
                  className="relative group hover:shadow-lg transition-all duration-200"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 opacity-100 transition-opacity z-10"
                    onClick={() => openSettingsModal(deck)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>

                  <Link href={`/decks/${deck.id}`}>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl line-clamp-1 pr-8">
                        {deck.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-teal-600" />
                        <span className="text-sm font-medium">
                          {deck.cardCount} cards
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {deck.quizType.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {deck.learningMode}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Created {new Date(deck.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            {decks.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No decks yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first deck to start learning
                </p>
                <Button onClick={onOpen} className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Deck
                </Button>
              </div>
            )}
          </div>

          <CreateDeckModal />
          <CreateCardModal />
          <DeckSettingsModal
            deck={selectedDeck}
            isOpen={isSettingsModalOpen}
            onClose={closeSettingsModal}
          />
        </div>
      )}
    </ProtectedPage>
  );
}
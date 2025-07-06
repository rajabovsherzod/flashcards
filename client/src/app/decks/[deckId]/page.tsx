"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  Play,
  Search,
  Lock,
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCreateCardModal } from "@/hooks/use-create-card-modal";
import { CreateCardModal } from "@/components/cards/create-card-modal";
import { useGetAllCardsByDeckId } from "@/hooks/use-get-all-cards-by-deck-id";
import { Card as CardType } from "@/lib/api/cards/card.types";
import { ProtectedPage } from "@/app/auth/protected-page";

// 🚀 CLEANED UP - studyStage parameter olib tashlandi
const formatNextViewTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Check if card is locked (future review)
  const isLocked = diffInHours > 1;

  if (isLocked) {
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)}h left`;
    } else {
      const days = Math.round(diffInHours / 24);
      return `${days}d left`;
    }
  }

  if (diffInHours < 1) {
    return "Ready";
  } else if (diffInHours < 24) {
    return `${Math.round(diffInHours)}h`;
  } else {
    const days = Math.round(diffInHours / 24);
    return `${days}d`;
  }
};

interface CardSettingsModalProps {
  card: CardType | null;
  isOpen: boolean;
  onClose: () => void;
}

function CardSettingsModal({ card, isOpen, onClose }: CardSettingsModalProps) {
  if (!isOpen || !card) return null;

  const handleEdit = () => {
    console.log("Edit card:", card.id);
    onClose();
  };

  const handleDelete = () => {
    console.log("Delete card:", card.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg border shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Card Settings</h3>
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-1">Front:</div>
            <div className="text-sm text-muted-foreground mb-2">
              {card.front}
            </div>
            <div className="text-sm font-medium mb-1">Back:</div>
            <div className="text-sm text-muted-foreground">{card.back}</div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="w-full justify-start"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Card
            </Button>

            <Button
              onClick={handleDelete}
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Card
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

export default function DeckDetailPage() {
  const params = useParams();
  const deckId = params.deckId as string;
  const { onOpen } = useCreateCardModal();
  const router = useRouter();

  // API call
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useGetAllCardsByDeckId(deckId);

  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isCardSettingsModalOpen, setIsCardSettingsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Get cards from API response
  const cards = apiResponse?.success ? apiResponse.data : [];

  // Filter cards based on search
  const filteredCards = cards.filter(
    (card) =>
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCards = filteredCards.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const openCardSettingsModal = (card: CardType) => {
    setSelectedCard(card);
    setIsCardSettingsModalOpen(true);
  };

  const closeCardSettingsModal = () => {
    setIsCardSettingsModalOpen(false);
    setSelectedCard(null);
  };

  const handleCreateCard = () => {
    onOpen(deckId);
  };

  // Check if card is locked (future review)
  const isCardLocked = (card: CardType) => {
    const reviewTime = new Date(card.nextReviewAt);
    const now = new Date();
    return reviewTime > now;
  };

  // 🎯 BITTA RETURN - BARCHA HOLATLAR UCHUN PROTECTED PAGE BILAN
  return (
    <ProtectedPage requireAuth={true}>
      {/* 1️⃣ LOADING STATE */}
      {isLoading && (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-teal-600" />
            <p className="text-muted-foreground">Loading cards...</p>
          </div>
        </div>
      )}

      {/* 2️⃣ ERROR STATE */}
      {error && (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error loading cards</h3>
            <p className="text-muted-foreground mb-4">
              {error.message || "Something went wrong"}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* 3️⃣ SUCCESS STATE - MAIN CONTENT */}
      {!isLoading && !error && (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Deck Cards
                  </h1>
                  <p className="text-muted-foreground">
                    {cards.length} cards in this deck
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.push(`/study?deckId=${deckId}`)}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Quick Study
                  </Button>
                  <Button
                    size="lg"
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={() => router.push(`/study?deckId=${deckId}`)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Study
                  </Button>
                </div>
              </div>
            </div>

            {/* Search and Add */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 h-12"
                />
              </div>
              <Button
                onClick={handleCreateCard}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Cards
              </Button>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {currentCards.map((card) => {
                const locked = isCardLocked(card);

                return (
                  <Card
                    key={card.id}
                    className="relative hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
                  >
                    {/* Lock Icon */}
                    {locked && (
                      <div className="absolute top-2 left-2 z-10">
                        <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-800">
                          <Lock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    )}

                    {/* Settings Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => openCardSettingsModal(card)}
                    >
                      <Settings className="w-3 h-3" />
                    </Button>

                    <CardContent className="px-3 py-2 h-28 flex flex-col justify-between">
                      {/* Front & Back Content */}
                      <div className="flex-1 space-y-1">
                        <div className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
                          {card.front}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2 leading-tight">
                          {card.back}
                        </div>
                      </div>

                      {/* Bottom Info */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        {/* Stage */}
                        <span className="text-xs text-muted-foreground font-medium">
                          Stage: {card.studyStage}
                        </span>

                        {/* Next Review Time - 🚀 CLEANED UP CALL */}
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-2.5 h-2.5 mr-1" />
                          <span className="font-medium">
                            {formatNextViewTime(card.nextReviewAt)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, filteredCards.length)} of{" "}
                  {filteredCards.length} cards
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredCards.length === 0 && (
              <div className="text-center py-12">
                {searchTerm ? (
                  <>
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No cards found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-2">No cards yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first cards to start learning
                    </p>
                    <Button
                      onClick={handleCreateCard}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Cards
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Modals */}
          <CreateCardModal />
          <CardSettingsModal
            card={selectedCard}
            isOpen={isCardSettingsModalOpen}
            onClose={closeCardSettingsModal}
          />
        </div>
      )}
    </ProtectedPage>
  );
}

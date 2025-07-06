"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  BarChart3,
  Home,
} from "lucide-react";
import { useModal } from "@/store/use-modal-store";

interface StudyResult {
  totalCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  studyDuration: number; // sekundlarda
  deckTitle: string;
}

export function StudyResultsModal() {
  const { isOpen, type, data, onClose } = useModal();
  const result = data.studyResult as StudyResult;

  const isModalOpen = isOpen && type === "studyResults";

  if (!isModalOpen || !result) return null;

  const accuracy =
    result.totalCards > 0
      ? Math.round((result.correctAnswers / result.totalCards) * 100)
      : 0;

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return "Excellent! You're mastering this material!";
    if (accuracy >= 80) return "Great job! You're doing very well!";
    if (accuracy >= 70) return "Good work! Keep practicing!";
    if (accuracy >= 60) return "Not bad! A bit more practice needed.";
    return "Keep studying! You'll improve with practice.";
  };

  const getPerformanceColor = () => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 80) return "text-blue-600";
    if (accuracy >= 70) return "text-yellow-600";
    if (accuracy >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getProgressColor = () => {
    if (accuracy >= 90) return "bg-green-500";
    if (accuracy >= 80) return "bg-blue-500";
    if (accuracy >= 70) return "bg-yellow-500";
    if (accuracy >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Study Results
            </span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Home className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Deck ma'lumoti */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              {result.deckTitle}
            </h3>
            <p className="text-sm text-muted-foreground">
              Study session completed
            </p>
          </div>

          {/* Asosiy statistika */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{result.totalCards}</div>
              <div className="text-sm text-muted-foreground">Total Cards</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">
                {formatDuration(result.studyDuration)}
              </div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
          </div>

          {/* To'g'ri/Javoblar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <div className="text-xl font-bold text-green-600">
                {result.correctAnswers}
              </div>
              <div className="text-sm text-green-600">Correct</div>
            </div>

            <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
              <XCircle className="w-6 h-6 mx-auto mb-1 text-red-600" />
              <div className="text-xl font-bold text-red-600">
                {result.incorrectAnswers}
              </div>
              <div className="text-sm text-red-600">Incorrect</div>
            </div>
          </div>

          {/* Aniqlik foizi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Accuracy</span>
              <span className={`text-lg font-bold ${getPerformanceColor()}`}>
                {accuracy}%
              </span>
            </div>
            {/* Custom progress bar */}
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <p className={`text-sm text-center ${getPerformanceColor()}`}>
              {getPerformanceMessage()}
            </p>
          </div>

          {/* Qo'shimcha statistika */}
          <div className="p-4 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Performance Summary</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>
                • Average time per card:{" "}
                {formatDuration(
                  Math.round(result.studyDuration / result.totalCards)
                )}
              </div>
              <div>
                • Cards per minute:{" "}
                {Math.round((result.totalCards / result.studyDuration) * 60)}
              </div>
              <div>• Success rate: {accuracy}%</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Back to Dashboard
          </Button>
          <Button
            onClick={() => {
              // Bu yerda yangi o'rganish sessiyasini boshlash mumkin
              onClose();
            }}
            className="flex-1"
          >
            Study Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

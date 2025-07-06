"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateCardModal } from "@/hooks/use-create-card-modal";
import { CreateCardSchema } from "./card.validation";
import { createBatchCards } from "@/lib/api/cards/cards";

export function CreateCardModal() {
  const { isOpen, onClose, deckId } = useCreateCardModal();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof CreateCardSchema>>({
    resolver: zodResolver(CreateCardSchema),
    defaultValues: {
      fronts: "",
      backs: "",
    },
  });

  const { mutate: createCardsMutation, isPending } = useMutation({
    mutationKey: ["create-batch-cards", deckId],
    mutationFn: createBatchCards,
    onSuccess: (data) => {
      toast.success(
        data.message || `${data.data.length} cards created successfully!`
      );

      queryClient.invalidateQueries({ queryKey: ["statistics"] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["cards", deckId] });

      handleClose();
    },
    onError: (error) => {
      let errorMessage = "Failed to create cards.";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    },
  });

  const onSubmit = (values: z.infer<typeof CreateCardSchema>) => {
    const frontsArray = values.fronts
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const backsArray = values.backs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (frontsArray.length !== backsArray.length || frontsArray.length === 0) {
      toast.error("The number of items must match and not be empty.");
      return;
    }

    const payload = {
      cards: frontsArray.map((front, index) => ({
        front: front,
        back: backsArray[index],
      })),
    };

    createCardsMutation({ deckId, payload });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add Cards to Your Deck
          </DialogTitle>
          <DialogDescription>
            Enter your terms and definitions below. Separate each item with a
            comma.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fronts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Front Sides (Terms)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. apple, banana, orange"
                        className="min-h-[250px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="backs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Back Sides (Definitions)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. olma, banan, apelsin"
                        className="min-h-[250px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  `Add ${
                    form
                      .getValues("fronts")
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean).length || 0
                  } Cards`
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

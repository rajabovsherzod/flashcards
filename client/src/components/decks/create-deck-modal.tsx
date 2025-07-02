"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter,} from "@/components/ui/dialog";
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateDeckModal } from "@/hooks/use-create-deck-modal";
import { useCreateCardModal } from "@/hooks/use-create-card-modal";
import { createDeckSchema, QuizType, LearningMode } from "./deck.validation";
import { createDeck } from "@/lib/api/decks/decks";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const quizTypes = Object.keys(QuizType) as (keyof typeof QuizType)[];
const learningModes = Object.keys( LearningMode) as (keyof typeof LearningMode)[];

export function CreateDeckModal() {
  const { isOpen, onClose } = useCreateDeckModal();
  const { onOpen: onOpenCreateCardModal } = useCreateCardModal();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof createDeckSchema>>({
    resolver: zodResolver(createDeckSchema),
    defaultValues: {
      title: "",
      quizType: "FLASHCARD",
      learningMode: "NORMAL",
    },
  });

  const { mutate: createDeckMutation, isPending } = useMutation({
    mutationKey: ["create-deck"],
    mutationFn: createDeck,
    onSuccess: (data) => {
      toast.success("Deck created successfully");

      queryClient.invalidateQueries({ queryKey: ["statistics"] });

      onClose();
      onOpenCreateCardModal(data.data.id);
    },
    onError: (error) => {
      toast.error("Failed to create deck", { description: error.message });
    },
  });

  const onSubmit = (values: z.infer<typeof createDeckSchema>) => {
    createDeckMutation(values);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create a new deck
          </DialogTitle>
          <DialogDescription>
            Get started by giving your deck a title and choosing your preferred
            study modes.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-[380px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 flex flex-col h-full"
            >
              <div className="flex-grow">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deck Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 'Spanish Vocabulary'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-8 mt-8">
                  <FormField
                    control={form.control}
                    name="quizType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Quiz Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            {quizTypes.map((type) => (
                              <FormItem
                                key={type}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={type} />
                                </FormControl>
                                <FormLabel className="font-normal capitalize">
                                  {type.toLowerCase().replace("_", " ")}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="learningMode"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Learning Mode</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            {learningModes.map((mode) => (
                              <FormItem
                                key={mode}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={mode} />
                                </FormControl>
                                <FormLabel className="font-normal capitalize">
                                  {mode.toLowerCase()}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter className="mt-auto pt-4">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    "Create Deck"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

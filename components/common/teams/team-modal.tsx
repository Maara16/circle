'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTeamsStore } from '@/store/teams-store';
import { useUsersStore } from '@/store/users-store';
import { Team, User } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  description: z.string().optional(),
  members: z.array(z.string()),
});

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team?: Team;
}

export default function TeamModal({ isOpen, onClose, team }: TeamModalProps) {
  const { addTeam, updateTeam } = useTeamsStore();
  const { users, fetchUsers } = useUsersStore();
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      members: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, fetchUsers]);

  useEffect(() => {
    if (team) {
      form.reset({
        name: team.name,
        description: team.description || '',
        members: team.members.map((m) => m._id),
      });
      setSelectedMembers(team.members);
    } else {
      form.reset();
      setSelectedMembers([]);
    }
  }, [team, form]);

  const handleMemberSelect = (member: User) => {
    const isSelected = selectedMembers.some((m) => m._id === member._id);
    let newSelectedMembers;
    if (isSelected) {
      newSelectedMembers = selectedMembers.filter((m) => m._id !== member._id);
    } else {
      newSelectedMembers = [...selectedMembers, member];
    }
    setSelectedMembers(newSelectedMembers);
    form.setValue('members', newSelectedMembers.map((m) => m._id));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (team) {
        await updateTeam(team._id, values);
        toast.success('Team updated successfully!');
      } else {
        await addTeam(values);
        toast.success('Team created successfully!');
      }
      onClose();
    } catch (error) {
      toast.error('An error occurred.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{team ? 'Edit Team' : 'Create Team'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>Members</FormLabel>
                  <Command>
                    <CommandInput placeholder="Search members..." />
                    <CommandList>
                      <CommandEmpty>No members found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            key={user._id}
                            onSelect={() => handleMemberSelect(user)}
                            className="flex items-center justify-between"
                          >
                            <span>{user.name}</span>
                            <Checkbox
                              checked={selectedMembers.some((m) => m._id === user._id)}
                              onCheckedChange={() => handleMemberSelect(user)}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedMembers.map((member) => (
                      <div key={member._id} className="flex items-center gap-1 bg-muted p-1 rounded">
                        <span>{member.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMemberSelect(member)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {form.formState.isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
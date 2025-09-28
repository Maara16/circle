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
import { useUsersStore } from '@/store/users-store';
import { useTeamsStore } from '@/store/teams-store';
import { User, Team } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(1, 'Member name is required'),
  email: z.string().email('Invalid email address'),
  teams: z.array(z.string()),
  role: z.string().min(1, 'Role is required'),
  status: z.enum(['active', 'inactive']),
});

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: User;
}

export default function MemberModal({ isOpen, onClose, member }: MemberModalProps) {
  const { addUser, updateUser } = useUsersStore();
  const { teams, fetchTeams } = useTeamsStore();
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      teams: [],
      role: 'Member',
      status: 'active',
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchTeams();
    }
  }, [isOpen, fetchTeams]);

  useEffect(() => {
    if (member) {
      form.reset({
        name: member.name,
        email: member.email,
        teams: member.teams,
        role: member.role,
        status: member.status,
      });
      const memberTeamObjects = teams.filter(team => member.teams.includes(team._id));
      setSelectedTeams(memberTeamObjects);
    } else {
      form.reset({
        name: '',
        email: '',
        teams: [],
        role: 'Member',
        status: 'active',
      });
      setSelectedTeams([]);
    }
  }, [member, teams, form]);

  const handleTeamSelect = (team: Team) => {
    const isSelected = selectedTeams.some((t) => t._id === team._id);
    let newSelectedTeams;
    if (isSelected) {
      newSelectedTeams = selectedTeams.filter((t) => t._id !== team._id);
    } else {
      newSelectedTeams = [...selectedTeams, team];
    }
    setSelectedTeams(newSelectedTeams);
    form.setValue('teams', newSelectedTeams.map((t) => t._id));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (member) {
        await updateUser(member._id, values);
        toast.success('Member updated successfully!');
      } else {
        await addUser(values);
        toast.success('Member created successfully!');
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
          <DialogTitle>{member ? 'Edit Member' : 'Create Member'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teams"
              render={() => (
                <FormItem>
                  <FormLabel>Teams</FormLabel>
                  <Command>
                    <CommandInput placeholder="Search teams..." />
                    <CommandList>
                      <CommandEmpty>No teams found.</CommandEmpty>
                      <CommandGroup>
                        {teams.map((team) => (
                          <CommandItem
                            key={team._id}
                            onSelect={() => handleTeamSelect(team)}
                            className="flex items-center justify-between"
                          >
                            <span>{team.name}</span>
                            <Checkbox
                              checked={selectedTeams.some((t) => t._id === team._id)}
                              onCheckedChange={() => handleTeamSelect(team)}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTeams.map((team) => (
                      <div key={team._id} className="flex items-center gap-1 bg-muted p-1 rounded">
                        <span>{team.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTeamSelect(team)}
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
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
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
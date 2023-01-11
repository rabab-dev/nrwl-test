import { create } from 'zustand'
import { Ticket, User } from '@acme/shared-models';

export type FilterType = "all" | "isCompleted" | "isNotCompleted";

interface StoreState {
    tickets: Ticket[];
    users: User[];
    filter: FilterType;
    fetchTickets: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    setFilter: (filter: FilterType) => void;
}

const useTicketStore = create<StoreState>()(set => ({
    tickets: [],
    users: [],
    filter: "all",
    fetchTickets: async () => {
        const response = await fetch('/api/tickets');
        set({ tickets: await response.json() })
    },
    fetchUsers: async () => {
        const response = await fetch('/api/users');
        set({ users: await response.json() });
    },
    setFilter: (filter: FilterType) => {
        set({ filter });
    }
}))

export default useTicketStore;
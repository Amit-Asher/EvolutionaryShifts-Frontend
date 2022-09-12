import { globalStore } from './../stores/globalStore';
import { TicketApi, TicketDTO } from './../swagger/stubs/api';

export namespace requestsService {

    export async function sendTicket(empName: string, msg: string): Promise<void> {
        try {
            globalStore.notificationStore.show({ message: 'sending new ticket...', severity:"success" });
            const res = await (new TicketApi()).addTicket({ empName, msg }, { credentials: 'include' })
            if (!res.success) {
                throw new Error("Failed to send ticket");
            }
            globalStore.notificationStore.show({ message: 'send ticket completed successfully', severity: "success" });
        } catch (err) {
            console.error('Failed to send ticket');
            globalStore.notificationStore.show({ message: 'Failed to send ticket', severity: "error" });
            throw err;
        }
    }

    export async function getAllTickets(): Promise<TicketDTO[]> {
        try {
            const res: TicketDTO[] = await (new TicketApi()).getAllTickets({ credentials: 'include' });
            if (!res) {
                globalStore.notificationStore.show({ message: 'Failed to fetch tickets', severity: "error" });
                return [];
            }
            return res ?? [];
        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to fetch tickets', severity: "error" });
            console.error('[companyService][getEmployees] Failed to fetch tickets');
            return [];
        }
    }
}
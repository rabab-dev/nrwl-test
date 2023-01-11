import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styles from './ticket-details.module.css';
import { Ticket } from '@acme/shared-models';
import useTicketStore from '../store';
import { Link } from 'react-router-dom';

export interface TicketDetailsProps { }

export function TicketDetails(props: TicketDetailsProps) {
  const [users, fetchUsers, fetchTickets] = useTicketStore(state => [
    state.users,
    state.fetchUsers,
    state.fetchTickets
  ]);
  const [ticket, setTicket] = useState<Ticket>();
  let { id } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    async function fetchTicketDetail() {
      try {
        const data = await fetch(`/api/tickets/${id}`, { signal });
        setTicket(await data.json());
      } catch (e) {
        console.error(e);
      }
    }

    fetchTicketDetail();
    fetchUsers();

    return () => {
      abortController.abort();
    }
  }, []);

  function handleAssigneeChange(e: ChangeEvent<HTMLSelectElement>) {
    fetch(`/api/tickets/${ticket?.id}/assign/${e.target.value}`,
      { method: "PUT" })
      .then(_ => {
        console.log("Assignee changed");
        fetchTickets();
      });
  }

  function handleComplete(e: React.MouseEvent<HTMLButtonElement>) {
    fetch(`/api/tickets/${ticket?.id}/complete`, {
      method: "PUT"
    })
      .then(_ => {
        console.log("Ticket complete")
        fetchTickets();
      });
  }

  return (
    <div className={styles['container']}>
      <h1>Welcome to TicketDetails!</h1>
      <p>Description: {ticket?.description}</p>

      {ticket && <div>
        <label htmlFor="assignee">Change Assignee: </label>
        <select name="assignee" id="asignee" defaultValue={ticket.assigneeId?.toString()} onChange={handleAssigneeChange}>
          {users?.map(user => <option value={user.id} key={user.id}>{user.name}</option>)}
        </select>
      </div>}
      <br />
      {/* this is cheating: I'd prefer checkbox */}
      <button onClick={(e) => handleComplete(e)}>Mark as complete</button>
      <br />
      <Link to="/">Back to all tickets</Link>
    </div >
  );
}

export default TicketDetails;

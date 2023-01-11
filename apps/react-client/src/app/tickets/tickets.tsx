
import { Ticket } from '@acme/shared-models';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useStore, { FilterType } from '../store';
import styles from './tickets.module.css';

export interface TicketsProps {
  tickets: Ticket[]
}


export function Tickets(props: TicketsProps) {
  const [filter, setFilter, fetchTickets] = useStore(state => [
    state.filter, state.setFilter, state.fetchTickets
  ]);
  const [filteredTickets, setFilteredTickets] = useState([] as Ticket[]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (props?.tickets) {
      if (filter !== "all") {
        const filteredTickets = props?.tickets
          .filter(ticket => ticket.completed === (filter === "isCompleted"));
        setFilteredTickets(filteredTickets);
      } else {
        setFilteredTickets(props?.tickets);
      }
    }
  }, [props?.tickets, filter]);



  function onHandleClick() {
    fetch('/api/tickets', {
      method: "POST", headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: JSON.stringify({ description })
    })
      .then(_ => {
        setDescription("");
        return fetchTickets();
      })
      .then(_ => console.log("Tickets refreshed"))
      .catch(console.error);
  }

  return (
    <div className={styles['tickets']}>
      <h2>Tickets</h2>
      <div>
        <label htmlFor='filter'>Filter: </label>
        <select name="filter" id="filter" defaultValue={filter} onChange={(e) => setFilter(e.target.value as FilterType)}>
          <option value="all">All Tickets</option>
          <option value="isCompleted">Completed</option>
          <option value="isNotCompleted">Not completed</option>
        </select>
      </div>

      <div>
        <label htmlFor='description'>Add Ticket: </label>
        <input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)}></input>
        <button onClick={onHandleClick}>Add</button>
      </div>


      {filteredTickets ? (
        <ul>
          {filteredTickets?.map((t) => (
            <li key={t.id}>
              <Link to={t.id.toString()}>Ticket: {t.id}, {t.description}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <span>...</span>
      )}
    </div>
  );
}

export default Tickets;

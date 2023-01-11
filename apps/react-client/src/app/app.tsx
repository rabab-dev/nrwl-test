import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import styles from './app.module.css';
import Tickets from './tickets/tickets';
import TicketDetails from './ticket-details/ticket-details';
import useTicketStore from './store';

const App = () => {
  const [tickets, fetchTickets] = useTicketStore(state => [state.tickets, state.fetchTickets]);
  useEffect(() => {
    fetchTickets();
  }, []);


  return (
    <div className={styles['app']}>
      <h1>Ticketing App</h1>
      <Routes>
        <Route path="/" element={<Tickets tickets={tickets} />} />
        {/* Hint: Try `npx nx g component TicketDetails --no-export` to generate this component  */}
        <Route path="/:id" element={<TicketDetails />} />
      </Routes>
    </div>
  );
};

export default App;

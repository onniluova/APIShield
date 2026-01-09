from app.db_conn import get_db_connection
from psycopg2.extras import RealDictCursor

class EndpointModel:
    @staticmethod
    def create(user_id, url, name):
        """Luo uuden seurattavan endpointin, jos vastaavaa ei jo löydy."""
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # 1. Tarkistetaan duplikaatit
                cur.execute("SELECT id FROM endpoints WHERE name=%s AND url=%s AND user_id=%s", (name, url, user_id))
                if cur.fetchone():
                    return None

                # 2. Lisätään uusi endpoint
                query = """
                    INSERT INTO endpoints (user_id, url, name)
                    VALUES (%s, %s, %s)
                    RETURNING id;
                """
                cur.execute(query, (user_id, url, name))
                new_id = cur.fetchone()[0]
                
                conn.commit()
                return new_id
        
    @staticmethod
    def delete_endpoint(endpoint_id):
        """Poistaa endpointin ID:n perusteella."""
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM endpoints WHERE id=%s", (endpoint_id,))
                conn.commit()

    @staticmethod
    def get_by_id(endpoint_id):
        """Hakee yksittäisen endpointin tiedot."""
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT * FROM endpoints WHERE id = %s', (endpoint_id,))
                return cur.fetchone()

    @staticmethod
    def get_all_endpoints(user_id):
        """Hakee kaikki tietyn käyttäjän endpointit."""
        with get_db_connection() as conn:
            # RealDictCursor tekee riveistä suoraan sanakirjoja (dict)
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT id, url, name FROM endpoints WHERE user_id = %s', (user_id,))
                return cur.fetchall() # Palauttaa listan sanakirjoja: [{"id": 1, "url": "..."}, ...]

    @staticmethod
    def get_every_endpoint():
        """Hakee aivan kaikki järjestelmän endpointit (esim. taustalla pyörivää skanneria varten)."""
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT id, url, name FROM endpoints')
                return cur.fetchall()
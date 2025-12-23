from app import create_app
from app.services.scheduler import start_scheduler

app = create_app()
start_scheduler(app)

if __name__ == '__main__':
    app.run(debug=True)
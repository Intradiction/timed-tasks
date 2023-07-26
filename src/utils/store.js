const cards = [
    {
        id: 'card-1',
        title: 'test card 1',
        timeLeft: {
            minutes: 5,
            seconds: 0,
        }
    },
    {
        id: 'card-2',
        title: 'test card 2',
        timeLeft: {
            minutes: 12,
            seconds: 34,
        }
    },
    {
        id: 'card-3',
        title: 'test card 3',
        timeLeft: {
            minutes: 30,
            seconds: 0,
        }
    }
];

const data = {
    lists: {
        'list-1': {
            id: 'list-1',
            title: 'Todo',
            cards,
        },
    },
    listIds: ['list-1'],
}

export default data;
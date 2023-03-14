const cards = [
    {
        id: 'card-1',
        title: 'test card 1'
    },
    {
        id: 'card-2',
        title: 'test card 2'
    },
    {
        id: 'card-3',
        title: 'test card 3'
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
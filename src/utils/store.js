const cards = [
    {
        id: 'card-1',
        content: 'test card 1'
    },
    {
        id: 'card-2',
        content: 'test card 2'
    },
    {
        id: 'card-3',
        content: 'test card 3'
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
// Currently this is just the example data for a non logged in user
const cards = [
    {
        id: 'card-1',
        title: 'test card 1',
        timeLeft: {
            minutes: 5,
            seconds: 0,
        },
        lastListId: 'list-1'
    },
    {
        id: 'card-2',
        title: 'test card 2',
        timeLeft: {
            minutes: 12,
            seconds: 34,
        },
        lastListId: 'list-1'
    },
    {
        id: 'card-3',
        title: 'test card 3',
        timeLeft: {
            minutes: 30,
            seconds: 0,
        },
        lastListId: 'list-1'
    },
    // {
    //     id: 'card-4',
    //     title: 'test card 4',
    //     timeLeft: {
    //         minutes: 5,
    //         seconds: 0,
    //     },
    //     lastListId: 'list-1'
    // },
    // {
    //     id: 'card-5',
    //     title: 'test card 5',
    //     timeLeft: {
    //         minutes: 12,
    //         seconds: 34,
    //     },
    //     lastListId: 'list-1'
    // },
    // {
    //     id: 'card-6',
    //     title: 'test card 6',
    //     timeLeft: {
    //         minutes: 30,
    //         seconds: 0,
    //     },
    //     lastListId: 'list-1'
    // }
];

const data = {
    lists: {
        'list-1': {
            id: 'list-1',
            title: 'Todo',
            cards,
        },
        'list-done': {
            id: 'list-done',
            title: 'Done',
            cards: []
        },        
    },
    listIds: ['list-1', 'list-done'],
}

export default data;
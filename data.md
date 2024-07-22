
restart_word: textbox
survey

start
name1
name2
name3
end


type: 'var'|'text'|'mcq'
msgs: ['', '', '']
params --> name: function_name: '', args: ['', '']
next: ''





{
    "restart_word": "restart",
    "survey": {
        "start": {
            "type": "var",
            "msgs": [
                "This is a test survey.",
                "What is today's date?"
            ],
            "next": "name"
        },
        "name": {
            "type": "var",
            "msgs": [
                "What's 5 + 5?"
            ],
            "next": "greet"
        },
        "greet": {
            "type": "text",
            "msgs": [
                "You get %%points%% points!"
            ],
            "params": {
                "points": {
                    "function_name": "get_score",
                    "args": [
                        "True",
                        "None",
                        10,
                        5
                    ]
                }
            }
        },
        "end": {
            "type": "text",
            "msgs": [
                "You win! This is the end of this partial demo-Thank you for playing!"
            ]
        }
    }
}
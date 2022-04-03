# Fantasy-Score-Calculator
This is a service written in node js which calculates fantasy points/scores for a match. The industry of fantasy gaming in India is moving at a great pace where you can continuously find new apps promoting and catering to fantasy gaming (especially cricket) for its audience. With the boom which seems never-ending, I thought of an idea to have a common code base for the same to calculate the same team performance on various platforms.

Most of the apps (as per current writing) do not have their own separate fantasy scoring logic or even if they have, they are just differentiated by points for actions and nothing else. For e.g. app A gives 1 point for 1 run whereas app B gives 0.5 points for 1 run for a batter. That's totally something someone can code in a proper generic way to fulfill all the common needs. Most of the apps currently follow the standards, set by the market owners i.e. Dream 11 and so I thought to have a code that can at least help a start-up or some ongoing apps to reuse the same logic in every way possible for their own use case.

# Motivation
The motivation for the idea seems to be a bit touchy/funny in whatever way you take that up. Someone reached out to me saying that they have a good opportunity for me at Dream11 which was a really good thing to hear. After a few days, I got to know that without any interview, my resume was rejected by the talent acquisition team member, purely based on the resume without taking in any efforts to interview me though I was having more experience for node.js than their job description requirements. I thought that I should write and try to create my own code for the same just to prove to myself that I was good enough. It just took me less than 4-6 hours to write the first mergeable code into the main which can adhere to all the 5 available cricketing formats (T10, The Hundreds, T20, ODI, and Test) for two of the most widely used apps of fantasy gaming i.e. Dream 11 and My11Circle. Even 5 more app scoring can be added just by setting up the configurations for them.

# Usage
The base framework for this code is Nest.js (https://docs.nestjs.com/) which is a supportive framework of node.js. In order to start the service, you need to install packages using yarn package manager once `yarn install` and then start with `yarn start`

```
curl --location --request POST 'http://localhost:3000/cricket/points' \
--header 'Content-Type: application/json' \
--data-raw '{
    "matchId": 1,
    "type": "T20",
    "strategy": "dream11",
    "players": [
        {
            "id": 1,
            "name": "Shikhar Dhawan",
            "role": "bat",
            "multiplier": "captain",
            "isPlaying": true,
            "batting": {
                "runs": 60,
                "balls": 30,
                "fours": 4,
                "sixes": 1,
                "isDismissed": false
            },
            "bowling": {
                "wickets": 2,
                "balls": 18,
                "runs": 16,
                "lbws": 1,
                "bowled": 1,
                "maidens": 1
            },
            "fielding": {
                "catches": 3,
                "runout": {
                    "direct": 1,
                    "indirect": 1
                },
                "stumpings": 1
            }
        },
        {
            "id": 1,
            "name": "Shubhman Gill",
            "multiplier": "normal",
            "role": "bat",
            "isPlaying": true,
            "batting": {
                "runs": 84,
                "balls": 46,
                "fours": 6,
                "sixes": 4,
                "isDismissed": true
            },
            "bowling": {
                "wickets": 0,
                "balls": 0,
                "runs": 0,
                "lbws": 0,
                "bowled": 0,
                "maidens": 0
            },
            "fielding": {
                "catches": 0,
                "runout": {
                    "direct": 0,
                    "indirect": 0
                },
                "stumpings": 0
            }
        }
    ]
}'
```

# What's next
1. Writing test cases to have the best coverage of all scenario
2. Decision-making on whether to expose the same as API or an NPM package library for usage. (Currently, it's working as API but does not have any database interactions within)
3. Decision making on the usage of the database being SQL or MongoDB (Currently it's having mongoose module configured in it but not directly being used)
4. Taking the match data in real-time for the code to be feed
5. Any more suggestions are welcomed on the same on what else can be done or how can it be improved

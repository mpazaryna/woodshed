%% 
- metadata:
	- tags: #spot-io #techtalk 
	- dates:  2021-03-16
	- people: Kevin McGrath
	- related: [[2021-03-16]]
%% 

# Serverless vs Containers

[the main event video w Kevin](https://www.youtube.com/watch?v=lnD6K876JY4)

Kevin | Spot by NetApp
- kevin say's containers are brilliant and his comment on life before containers  
- certainly rings true to our experience at Sungard and Viewpoint
- docker construct is awesome and then taking the box out to other places is an entire development change
- cut down on dependencies
- how to scale containers
- prior to this, we built vms
- docker got complex in the introduction of schedulers, rancher kubernetes etc
- how do i run it, is when things got complex
- functions as a service was the AskChristee option
- how do you make containers as simple as possible to run
- how do you manage all of the resources once you get to the cloud
- it's good that schedulers are dropping off and kubernetes easier to run
- you can get the benefit of serverless inside of containers
- you do have more control of the options in containers, arm, cpu etc
- optimization and cost efficiency, operations etc is important as you get to prod
- backup strategy when that service goes down
- containers allow for legacy and modern apps to run together and in any system with scaling
- containers change the way we use cloud

Forrest | A Cloud Guru
- serverless as a code shipping mode is probably dead
- Function as a service, may be dead and lambda is changing
- containers has won
- serverless mindset is what is changing the world
- own less, build more
- container is about repacking the past, serverless is a different paradigm
- 3 reasons
- 1 violates the second law of thermodynamics
- every line of code starts a decay cycle
- the code improves, based on the serverless providers improvement in its service
- serverless is expensive, but it's just money
- it's not free in terms of no-ops
- as developers we want to build instead of buy
- vendor lock in is awesome in serverless
- everybody is locked in on something
- serverless is not a pancea it's an idea

Cheryl Hung | CNCF
- Cloud native wins hands done
- Application developer background, wrote in containers 10 years back
- Doesn't want to think about infrastructure
- Own less build more

Josh Atwell | Splunk
- Serverless is a mindset that folks should be looking towards
- Developers need to trust and depend on function as a service

Kaslin Fields | Google
- we still have lots of code outside of serverless and containers
- application modernization is the thought
- lift and shift, into the cloud, into vm etc
- native cloud is when you move into containers

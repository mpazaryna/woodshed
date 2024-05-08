package main

// Other programming languages have a lot of different types of loops (while, do, until, foreach, …) 
// but Go only has one that can be used in a variety of different ways.


import "fmt"

func main() {
    i := 1
    for i <= 10 {
        fmt.Println(i)
        i = i + 1
    }
}
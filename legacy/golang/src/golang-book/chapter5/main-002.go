package main

// Other programming languages have a lot of different types of loops (while, do, until, foreach, …) 
// but Go only has one that can be used in a variety of different ways.


import "fmt"

func main() {
    for i := 1; i <= 10; i++ {
       if i % 2 == 0 {
            fmt.Println(i, "even")
        } else {
            fmt.Println(i, "odd")
        }
    }
}
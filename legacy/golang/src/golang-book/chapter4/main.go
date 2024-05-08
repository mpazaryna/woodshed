package main

import "fmt"

func main() {
    var x string
    // x takes the string Hello World
    // This distinction is important because (as their name would suggest) variables can change their value throughout the lifetime of a program. 
    x = "Hello World"
    fmt.Println(x)
    x = "Hello NYC"
    fmt.Println(x)
}
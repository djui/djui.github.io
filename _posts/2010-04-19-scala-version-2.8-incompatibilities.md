Scala version 2.8 - Incompatibilities
 
If you are interested in learning Scala as a new tool in your skill set, you
might have started to read the book "Programming in Scala - A comprehensive 
step-by-step guide" by Martin Odersky et al[1]. But as the book's examples are 
based on Scala version 2.7.4 some will not work anymore in version 2.8. For 
example Listing 3.10:

import scala.io.Source

if (args.length > 0) {
  for (line <- Source.fromFile(args(0)).getLines)
    print(line.length + " " + line)
} else
  Console.err.println("Please enter filename")

scala.io.Source is undertaken quite a lot of changes and does allow fromFile()
only anymore if the parameter variable (or value) is of type File.
So now you will have to change the example to use fromPath() which expects 
a String pointing to a file. Also getLines will have to have the parenthesis 
attached as in getLines. I have absolutely no clue at the moment why this is
the case. The final result will look like this:

import scala.io.Source

if (args.length > 0) {
  for (line <- Source.fromPath(args(0)).getLines())
    print(line.length + " " + line)
} else
  Console.err.println("Please enter filename")

This is just one example where new software release is breaking old code. In
an old Java world, this would have been much rarer the case. Actually I think
it is quite frightening imagine you have a huge code base to check first. And
other than in Java you don't get a deprecated warning[2]. It is just not 
available.

There has been some discussion[3][4] about the issues of the scala.io.Source
library.

I wonder how much of these issues my journey will revail when learning Scala.
So far, I like the high degree of flexibility expression your algorihms and
application logic. Also the concept of "traits", similar to Ruby and JS. But 
I'm a bit hesitated to judge if the compatability to Java's libraries is 
really a good think. Too many strange side- and footnotes[5][6] are already 
squeezed into the book trying to explain inconsistencies in what a beginner 
with either a background of Erlang as functional or Python/JS as dynamic 
programming languages might have on their mind.

[1] http://www.scala-lang.org/node/959

[2] Yes, you can get deprecated warnings with the "-deprecation" flag, but not
for this case.

[3] http://nikolajlindberg.blogspot.com/2009/11/sources-getlines-in-scala-28-now-strips.html

[4] http://stackoverflow.com/questions/1284423/read-entire-file-in-scala

[5] "Why not append to lists? Class List does not offer an append operation, 
because [...]"

[6] "Accessing the elements of a tuple: You may be wondering why you can’t 
access the elements of a tuple like the elements of a list [...]"

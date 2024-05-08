PAY = (PR * IN) / (1 - Math.pow(1 + IN, -PE))
 
 As you can see in the above source code extracted from one of my mortgage calculators,  
 the Javascript mortgage calculator uses the Math.pow(x, y) Javascript function.  
 
 In Math.pow (x, y) x is the base number and y is the exponent (the power to which the   
 base number is raised). For example, Math.pow(3, 2) raises 3 to the power of 2, which gives 9.  
 
 Our javascript mortgage calculator formula is fine, except for one small detail,   
 we need to find out the monthly mortgage payments, not the annual mortgage payments   
 (bi-weekly mortgage payments calculations are also possible).  
 
 This means that the javascript mortgage calculator will have to divide the   
 interest rate (IN) by 12 (converting the annual mortgage interest rate into a monthly   
 mortgage interest rate)  
  
 The mortgage calculator will also have to convert the number of periods (PE) into monthly   
 mortgage loan payment periods by multiplying it by 12.  
 
 Finaly, in order to do it’s calculations, the javascript mortgage calculator will   
 need the following input values:  
  
 PR (present value of the mortgage loan or principal amount)  
 IN (annual interest rate of the mortgage loan)  
 PE (number of periods of the mortgage loan in years, or loan term in years)  
  
 @param principal float amount borrowed  
 @param rate interest expressed as percentage  
 @param term term in years  
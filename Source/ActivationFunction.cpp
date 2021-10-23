#include <algorithm>

#include "Headers/ActivationFunction.hpp"

float activation_function(bool i_derivative, float i_input)
{
	//Machine learning requires calculus.
	//And I know what derivatives are.
	//So I know calculus.
	//Like 1% of it.
	//Oh yeah.
	if (0 == i_derivative)
	{
		if (0 >= i_input)
		{
			return pow(2, i_input - 1);
		}
		else
		{
			return 1 - pow(2, -1 - i_input);
		}
	}
	else
	{
		if (0 >= i_input)
		{
			//log(x) means ln(x) in the C++ standard library language.
			//By the way, when I found out that the backpropagation uses derivatives, I was like "BUT WHAT'S THE DERIVATIVE OF MY FUNCTION?!"
			//But thanks to the internet, I found out it's this thing.
			return log(2) * pow(2, i_input - 1);
		}
		else
		{
			return log(2) * pow(2, -1 - i_input);
		}
	}
}
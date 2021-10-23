#include <algorithm>
#include <array>
#include <chrono>
#include <vector>

#include "Headers/Global.hpp"
#include "Headers/GetMaxElement.hpp"

float get_max_element(const vector_1d& i_vector)
{
	return *std::max_element(i_vector.begin(), i_vector.end());
}

float get_max_element(const vector_2d& i_vector)
{
	float output = FLT_MIN;

	for (const vector_1d& a : i_vector)
	{
		//We're using recursion! ---------
		//                               |
		//                               |
		//                              \/
		output = std::max(output, get_max_element(a));
	}

	return output;
}

float get_max_element(const vector_3d& i_vector)
{
	float output = FLT_MIN;

	for (const vector_2d& a : i_vector)
	{
		output = std::max(output, get_max_element(a));
	}

	return output;
}
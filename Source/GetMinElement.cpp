#include <algorithm>
#include <array>
#include <chrono>
#include <vector>

#include "Headers/Global.hpp"
#include "Headers/GetMinElement.hpp"

float get_min_element(const vector_1d& i_vector)
{
	return *std::min_element(i_vector.begin(), i_vector.end());
}

float get_min_element(const vector_2d& i_vector)
{
	float output = FLT_MAX;

	for (const vector_1d& a : i_vector)
	{
		//We're using recursion! ---------
		//                               |
		//                               |
		//                              \/
		output = std::min(output, get_min_element(a));
	}

	return output;
}

float get_min_element(const vector_3d& i_vector)
{
	float output = FLT_MAX;

	for (const vector_2d& a : i_vector)
	{
		output = std::min(output, get_min_element(a));
	}

	return output;
}
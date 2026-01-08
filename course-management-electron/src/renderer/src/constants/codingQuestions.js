const codingQuestions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    timeLimit: 0.5, // 20 minutes for Easy
    topic: "Arrays",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    example:
      "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
    constraints:
      "2 <= nums.length <= 104\n-109 <= nums[i] <= 109\n-109 <= target <= 109",
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    timeLimit: 20,
    topic: "Stacks",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    example:
      "Input: s = '()[]{}'\nOutput: true\nInput: s = '([)]'\nOutput: false",
    constraints:
      "1 <= s.length <= 104\ns consists of parentheses only '()[]{}'.",
  },
  {
    id: 3,
    title: "Reverse Linked List",
    difficulty: "Easy",
    timeLimit: 20,
    topic: "Linked Lists",
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    example: "Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]",
    constraints: "The number of nodes in the list is [0, 5000]",
  },
  {
    id: 4,
    title: "Binary Search",
    difficulty: "Easy",
    timeLimit: 20,
    topic: "Searching",
    description:
      "Given an array of integers nums which is sorted in ascending order, and a target integer, write a function to search target in nums.",
    example: "Input: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4",
    constraints: "1 <= nums.length <= 104\n-104 < nums[i], target < 104",
  },
  {
    id: 5,
    title: "Maximum Subarray",
    difficulty: "Medium",
    timeLimit: 30, // 30 minutes for Medium
    topic: "Arrays",
    description:
      "Given an integer array nums, find the contiguous subarray with the largest sum, and return its sum.",
    example:
      "Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: [4,-1,2,1] has the largest sum = 6.",
    constraints: "1 <= nums.length <= 105\n-104 <= nums[i] <= 104",
  },
  {
    id: 6,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    timeLimit: 20,
    topic: "Linked Lists",
    description:
      "Merge two sorted linked lists and return it as a sorted list.",
    example: "Input: l1 = [1,2,4], l2 = [1,3,4]\nOutput: [1,1,2,3,4,4]",
    constraints: "The number of nodes in both lists is in the range [0, 50]",
  },
  {
    id: 7,
    title: "Valid Palindrome",
    difficulty: "Easy",
    timeLimit: 20,
    topic: "Strings",
    description:
      "Given a string s, return true if it is a palindrome, considering only alphanumeric characters and ignoring cases.",
    example: "Input: s = 'A man, a plan, a canal: Panama'\nOutput: true",
    constraints: "1 <= s.length <= 2 * 105",
  },
  {
    id: 8,
    title: "Group Anagrams",
    difficulty: "Medium",
    timeLimit: 30,
    topic: "Strings",
    description: "Given an array of strings strs, group the anagrams together.",
    example:
      "Input: strs = ['eat','tea','tan','ate','nat','bat']\nOutput: [['bat'],['nat','tan'],['ate','eat','tea']]",
    constraints: "1 <= strs.length <= 104\n0 <= strs[i].length <= 100",
  },
  {
    id: 9,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    timeLimit: 30,
    topic: "Trees",
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values.",
    example:
      "Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]",
    constraints: "The number of nodes in the tree is in range [0, 2000]",
  },
  {
    id: 10,
    title: "Merge Intervals",
    difficulty: "Medium",
    timeLimit: 30,
    topic: "Arrays",
    description:
      "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
    example:
      "Input: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]",
    constraints: "1 <= intervals.length <= 104",
  },
  {
    id: 11,
    title: "Climbing Stairs",
    difficulty: "Easy",
    timeLimit: 20,
    topic: "Dynamic Programming",
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps.",
    example:
      "Input: n = 3\nOutput: 3\nExplanation: There are three ways to climb to the top.",
    constraints: "1 <= n <= 45",
  },
  {
    id: 12,
    title: "3Sum",
    difficulty: "Medium",
    timeLimit: 30,
    topic: "Arrays",
    description:
      "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    example: "Input: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]",
    constraints: "0 <= nums.length <= 3000",
  },
  {
    id: 13,
    title: "Word Break",
    difficulty: "Medium",
    timeLimit: 30,
    topic: "Dynamic Programming",
    description:
      "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    example: "Input: s = 'leetcode', wordDict = ['leet','code']\nOutput: true",
    constraints: "1 <= s.length <= 300",
  },
  {
    id: 14,
    title: "Rotate Image",
    difficulty: "Medium",
    timeLimit: 30,
    topic: "Arrays",
    description:
      "You are given an n x n 2D matrix representing an image. Rotate the image by 90 degrees (clockwise).",
    example:
      "Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [[7,4,1],[8,5,2],[9,6,3]]",
    constraints: "n == matrix.length == matrix[i].length",
  },
  {
    id: 15,
    title: "LRU Cache",
    difficulty: "Medium",
    timeLimit: 30,
    topic: "Design",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    example:
      "Input: ['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get']\nOutput: [null, null, null, 1, null, -1, null, 3, 4, 4]",
    constraints: "1 <= capacity <= 3000",
  },
  {
    id: 16,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    timeLimit: 30,
    topic: "Strings",
    description:
      "Given a string s, return the longest palindromic substring in s.",
    example:
      "Input: s = 'babad'\nOutput: 'bab'\nNote: 'aba' is also a valid answer.",
    constraints: "1 <= s.length <= 1000",
  },
  {
    id: 17,
    title: "Course Schedule",
    difficulty: "Medium",
    timeLimit: 30,
    topic: "Graphs",
    description:
      "There are a total of numCourses courses you have to take. Some courses may have prerequisites.",
    example: "Input: numCourses = 2, prerequisites = [[1,0]]\nOutput: true",
    constraints: "1 <= numCourses <= 2000",
  },
  {
    id: 18,
    title: "Implement Trie",
    difficulty: "Medium",
    timeLimit: 30,
    topic: "Trees",
    description:
      "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.",
    example:
      "Input: ['Trie', 'insert', 'search', 'search', 'startsWith', 'insert', 'search']\nOutput: [null, null, false, false, true, null, true]",
    constraints: "1 <= word.length, prefix.length <= 2000",
  },
  {
    id: 19,
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    timeLimit: 45, // 45 minutes for Hard
    topic: "Heap",
    description:
      "Design a data structure that supports adding integers and finding the median of the stored integers.",
    example:
      "Input: ['MedianFinder', 'addNum', 'addNum', 'findMedian']\nOutput: [null, null, null, 1.5]",
    constraints: "-105 <= num <= 105",
  },
  {
    id: 20,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    timeLimit: 45,
    topic: "Trees",
    description:
      "Design an algorithm to serialize and deserialize a binary tree.",
    example:
      "Input: root = [1,2,3,null,null,4,5]\nOutput: [1,2,3,null,null,4,5]",
    constraints: "The number of nodes in the tree is in the range [0, 104]",
  },
];

export default codingQuestions;

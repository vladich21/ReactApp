// src/components/ProductList.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import ProductList from './ProductList';

jest.mock('axios');

const mockProducts = {
  products: [
    { id: 1, title: 'Product 1' },
    { id: 2, title: 'Product 2' },
  ],
  total: 2,
};

test('renders product list and paginates', async () => {
  axios.get.mockResolvedValueOnce({ data: mockProducts });

  render(<ProductList />);

  expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.queryByText('2')).not.toBeInTheDocument();
});

test('searches for products', async () => {
  axios.get.mockResolvedValueOnce({ data: mockProducts });

  render(<ProductList />);

  const searchInput = screen.getByPlaceholderText('Search products...');
  fireEvent.change(searchInput, { target: { value: 'Product' } });

  await waitFor(() => {
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });
});

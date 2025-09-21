<template>
  <div class="min-h-screen bg-black text-white pt-20 pb-16">
    <div class="max-w-6xl mx-auto px-4 md:px-8">
      <!-- Back Button -->
      <div class="mb-8 flex justify-between items-center">
        <router-link 
          to="/guest-book" 
          class="inline-flex items-center text-white hover:text-red-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Buku Tamu
        </router-link>
      </div>
      
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold mb-2">Daftar Tamu</h1>
        <p class="text-gray-400">Daftar tamu yang telah mengisi buku tamu</p>
      </header>

      <!-- Search and Filter -->
      <div class="mb-6 bg-gray-900 rounded-lg border border-gray-800 p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label for="search" class="sr-only">Cari Tamu</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                v-model="searchTerm"
                @input="handleSearch"
                type="text"
                placeholder="Cari berdasarkan nama atau alamat..."
                class="block w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
          <div class="w-full md:w-40">
            <label for="entries" class="sr-only">Entri per halaman</label>
            <select
              id="entries"
              v-model="entriesPerPage"
              @change="resetPagination"
              class="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="5">5 Entri</option>
              <option value="10">10 Entri</option>
              <option value="25">25 Entri</option>
              <option value="50">50 Entri</option>
              <option value="100">100 Entri</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-400 text-lg">Memuat data tamu...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredEntries.length === 0" class="text-center py-20 bg-gray-900 rounded-lg border border-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-gray-400 text-lg font-medium">
          {{ searchTerm ? 'Tidak ada tamu yang cocok dengan pencarian Anda.' : 'Belum ada tamu yang mengisi buku tamu.' }}
        </p>
        <div v-if="searchTerm" class="mt-4">
          <button @click="clearSearch" class="text-red-500 hover:text-red-400 font-medium">
            Reset Pencarian
          </button>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="overflow-hidden bg-gray-900 rounded-lg border border-gray-800">
        <table class="min-w-full divide-y divide-gray-800">
          <thead class="bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                No
              </th>
              <th 
                scope="col" 
                class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                @click="sortBy('name')"
              >
                <div class="flex items-center">
                  Nama
                  <svg 
                    v-if="sortColumn === 'name'" 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="ml-1 h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      v-if="sortDirection === 'asc'" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 15l7-7 7 7" 
                    />
                    <path 
                      v-else 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </div>
              </th>
              <th 
                scope="col" 
                class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                @click="sortBy('address')"
              >
                <div class="flex items-center">
                  Alamat
                  <svg 
                    v-if="sortColumn === 'address'" 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="ml-1 h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      v-if="sortDirection === 'asc'" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 15l7-7 7 7" 
                    />
                    <path 
                      v-else 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </div>
              </th>
              <th 
                scope="col" 
                class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                @click="sortBy('created_at')"
              >
                <div class="flex items-center">
                  Tanggal
                  <svg 
                    v-if="sortColumn === 'created_at'" 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="ml-1 h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      v-if="sortDirection === 'asc'" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 15l7-7 7 7" 
                    />
                    <path 
                      v-else 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-900 divide-y divide-gray-800">
            <tr v-for="(entry, index) in paginatedEntries" :key="entry.id" class="hover:bg-gray-800">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ (currentPage - 1) * entriesPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-medium mr-3">
                    {{ entry.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="text-sm font-medium text-white">{{ entry.name }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ entry.address }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ formatDate(entry.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && totalPages > 1" class="mt-6 flex justify-between items-center bg-gray-900 rounded-lg border border-gray-800 p-4">
        <div class="text-sm text-gray-400">
          Menampilkan {{ paginationInfo.from }} - {{ paginationInfo.to }} dari {{ filteredEntries.length }} entri
        </div>
        <div class="flex space-x-2">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1" 
            class="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Sebelumnya
          </button>
          
          <div class="hidden md:flex space-x-2">
            <button 
              v-for="page in paginationRange" 
              :key="page" 
              @click="goToPage(page)" 
              :class="[
                'px-4 py-2 border text-sm font-medium rounded-md',
                currentPage === page 
                  ? 'bg-red-600 text-white border-red-600'
                  : 'border-gray-700 text-white hover:bg-gray-800'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <div class="md:hidden flex items-center space-x-1">
            <span class="text-gray-400">{{ currentPage }} / {{ totalPages }}</span>
          </div>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage >= totalPages" 
            class="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Berikutnya
            <svg class="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useWeddingStore } from '@/store/wedding';
import type { GuestBook } from '@/store/wedding';

const store = useWeddingStore();

// State
const loading = ref(true);
const searchTerm = ref('');
const entriesPerPage = ref(10);
const currentPage = ref(1);
const sortColumn = ref('created_at');
const sortDirection = ref<'asc' | 'desc'>('desc');
const searchTimeout = ref<number | null>(null);

// Computed
const guestBookEntries = computed(() => store.guestBookEntries);

// Filtered entries based on search
const filteredEntries = computed(() => {
  if (!searchTerm.value) return [...guestBookEntries.value];
  
  const term = searchTerm.value.toLowerCase();
  return guestBookEntries.value.filter(entry => 
    entry.name.toLowerCase().includes(term) || 
    entry.address.toLowerCase().includes(term)
  );
});

// Sorted entries
const sortedEntries = computed(() => {
  return [...filteredEntries.value].sort((a, b) => {
    let valA, valB;
    
    if (sortColumn.value === 'created_at') {
      valA = new Date(a.created_at || '').getTime();
      valB = new Date(b.created_at || '').getTime();
    } else {
      valA = (a[sortColumn.value as keyof GuestBook] as string || '').toLowerCase();
      valB = (b[sortColumn.value as keyof GuestBook] as string || '').toLowerCase();
    }
    
    if (sortDirection.value === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });
});

// Pagination
const totalPages = computed(() => 
  Math.max(1, Math.ceil(filteredEntries.value.length / entriesPerPage.value))
);

const paginatedEntries = computed(() => {
  const startIndex = (currentPage.value - 1) * entriesPerPage.value;
  const endIndex = startIndex + entriesPerPage.value;
  return sortedEntries.value.slice(startIndex, endIndex);
});

const paginationInfo = computed(() => {
  const from = filteredEntries.value.length === 0 
    ? 0 
    : (currentPage.value - 1) * entriesPerPage.value + 1;
    
  const to = Math.min(
    currentPage.value * entriesPerPage.value,
    filteredEntries.value.length
  );
  
  return { from, to };
});

const paginationRange = computed(() => {
  const totalVisible = 5;
  const totalPages = Math.ceil(filteredEntries.value.length / entriesPerPage.value);
  
  if (totalPages <= totalVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  // Always show first page, last page, and current page
  // Along with one page before and after current page
  let startPage = Math.max(1, currentPage.value - 1);
  let endPage = Math.min(totalPages, currentPage.value + 1);
  
  // Adjust if we're at the start
  if (startPage <= 2) {
    startPage = 1;
    endPage = Math.min(totalVisible, totalPages);
  } 
  // Adjust if we're at the end
  else if (endPage >= totalPages - 1) {
    startPage = Math.max(1, totalPages - totalVisible + 1);
    endPage = totalPages;
  } 
  // In the middle with enough pages on each side
  else {
    startPage = Math.max(1, currentPage.value - Math.floor(totalVisible / 2));
    endPage = Math.min(totalPages, startPage + totalVisible - 1);
    
    // Adjust again if we don't have enough pages at the end
    if (endPage - startPage + 1 < totalVisible) {
      startPage = Math.max(1, endPage - totalVisible + 1);
    }
  }
  
  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
});

// Methods
const handleSearch = () => {
  // Debounce search to avoid unnecessary filtering
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1;
  }, 300) as unknown as number;
};

const clearSearch = () => {
  searchTerm.value = '';
  currentPage.value = 1;
};

const resetPagination = () => {
  currentPage.value = 1;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
};

const sortBy = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Watch for changes in filteredEntries
watch(filteredEntries, () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value;
  }
});

// Load data
onMounted(async () => {
  try {
    loading.value = true;
    
    if (guestBookEntries.value.length === 0) {
      await store.fetchGuestBookEntries();
    }
  } catch (error) {
    console.error('Error fetching guest book entries:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <div class="container">
    <v-card>
      <v-card-title>
        ARTICULOS
      </v-card-title>
      <v-card-subtitle>
        CRUD de articulos
      </v-card-subtitle>

      <v-data-table
        :headers="headers"
        :items="articulos"
        sort-by="descripcion"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>LISTADO DE ARTÍCULOS</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  NUEVO ARTICULO
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="form.descripcion"
                          label="Descripcion"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="form.precio"
                          label="Precio"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="form.stock"
                          label="Stock"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                  >
                    CANCELAR
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                  >
                    GUARDAR
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">Seguro de elimnar este artículo?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          No hay datos registrados
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
export default {
  name:"Articulos",
  data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'DESCRIPCION',
          align: 'start',
          sortable: false,
          value: 'descripcion',
        },
        { text: 'PRECIO', value: 'precio' },
        { text: 'STOCK', value: 'stock' },
        { text: 'ACCIONES', value: 'actions', sortable: false },
      ],
      articulos: [],
      editedIndex: -1,
      form: {
        descripcion: null,
        precio: null,
        stock: null,
      },
      // editedItem: {
      //   name: '',
      //   calories: 0,
      //   fat: 0,
      //   carbs: 0,
      //   protein: 0,
      // }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'CREAR ARTICULO' : 'EDITAR ARTICULO'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
      // this.$axios.get('/articulos')
      // this.$axios.get(`https://jsonplaceholder.typicode.com/albums`).then(response => {
        // console.log(response.data)
      // })
    },

    methods: {
      async initialize() {
        await this.$axios.get('articulos')
        .then(response => {
          this.articulos = response.data
        })
        .catch( error => {
          console.log(error)
        })
      },
      refresh() {
        this.form = {
          descripcion: null,
          precio: null,
          stock: null,
        }
      },
      editItem (item) {
        console.log('llego ediar')
        this.editedIndex = this.articulos.indexOf(item)
        // this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        // console.log(item.id)
        // this.editedIndex = this.articulos.indexOf(item)
        this.$axios.delete(`articulos/${item.id}`, this.form)
        .then(response => {
          this.initialize(response)
        })
        .catch( error => {
          console.log(error)
        })
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.articulos.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          // this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedIndex = -1
        })
      },

      async save () {
        if (this.editedIndex > -1) {
          console.log('EDITAR')
          // Object.assign(this.articulos[this.editedIndex], this.editedItem)
        } else {
          await this.$axios.post('articulos', this.form)
          .then(response => {
            this.initialize(response)
            this.refresh()
          })
          .catch( error => {
            console.log(error)
          })
        }
        this.close()
      },
    },
}
</script>
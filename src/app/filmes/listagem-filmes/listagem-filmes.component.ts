import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { FilmesService } from 'src/app/core/filmes.service';
import { ConfigParams } from 'src/app/shared/models/config-params';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit {

  readonly semImagem = "https://www.controlemunicipal.com.br/site/prefeitura/images/sem_foto_.jpg";

  config: ConfigParams = {
    pagina: 0,
    limite: 5,
  };

  filmes: Filme[] = [];
  filtrosListagem: FormGroup;
  generos: Array<string>;

  constructor(
              private filmesService: FilmesService,
              private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.filtrosListagem = this.fb.group(
      {
        texto: [''],
        genero: ['']
      }
    )

    this.filtrosListagem.get('texto').valueChanges.pipe(debounceTime(1000)).subscribe((val: string) => {
      this.config.pesquisa = val;
      this.resetarCOnsulta();
    });

    this.filtrosListagem.get('genero').valueChanges.subscribe((val: string) => {
      this.config.campo = {tipo: 'genero', valor: val};
      this.resetarCOnsulta();
    });

    this.generos = ['Ação', 'Romance', 'Aventura', 'Terror', 'Ficção Científica', 'Comédia', 'Drama'];
    this.listaFilmes();
  }

  onScroll(): void {
    this.listaFilmes();
  }

  private listaFilmes(): void {
    this.config.pagina++;
    this.filmesService.listar(this.config).subscribe((filmes: Filme[]) => this.filmes.push(...filmes));
  }

  private resetarCOnsulta(): void {
    this.config.pagina = 0;
    this.filmes = [];
    this.listaFilmes();
  }
}
